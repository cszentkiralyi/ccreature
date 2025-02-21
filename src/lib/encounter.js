import Constants from './constants.js';
import Util from './util.js';
import Rules from '../data/rules.js';

const ES = Constants.ENCOUNTER_STATE;
const AA = Constants.AFFIX_ACTION;
const RES = Constants.RESOURCE;

const CS = Constants.gen_enum([ 'PLAYER', 'ENEMY' ]);
const CM = Constants.gen_enum([ 'PLAY', 'DRAW' ]);

class GameLoop {
  state = 'idle';
  stateCycle;
  stateQueue;
  cycleIndex = 0;
  handleState;
  _skipnext = [];

  constructor(cycle, initial, handle) {
    this.stateCycle = cycle;
    this.stateQueue = [initial];
    this.handleState = handle;
  }

  nextState() {
    let q = this.stateQueue.length, next;
    if (q > 1) {
      next = this.stateQueue[0]
      if (!this.validateState(next))
        return this.nextState();
      this.state = next;
      this.stateQueue = this.stateQueue.slice(1, q);
    } else if (q == 1) {
      next = this.stateQueue.pop();
      if (!this.validateState(next))
        return this.nextState();
      this.state = next;
    } else {
      let next = this.stateCycle[this.cycleIndex++];
      if (this.cycleIndex > this.stateCycle.length - 1)
        this.cycleIndex = 0;
      if (!this.validateState(next))
        return this.nextState();
      this.state = next;
    }
    this.handleState(this.state);
  }

  queueState(s) { this.stateQueue.push(s); }

  setState(s) { this.state = s; }

  skipState(s) { this._skipnext.push(s); }

  validateState(s) {
    let i = this._skipnext.indexOf(s);
    if (i > -1) {
      this._skipnext.splice(i, 1);
      return false;
    }
    return true;
  }
}

class EncounterDeck {
  _cards;
  _draw;
  _discard;

  constructor(cards) {
    let i;
    let deck = cards.reduce((d, { card, count }) => {
      for (i = 0; i < count; i++) d.push(card);
      return d;
    }, []);
    this._cards = deck;
    this._draw = Util.shuffle(deck);
    this._discard = [];
  }

  count(pile) {
    switch (pile) {
      case 'draw': return this._draw.length;
      case 'discard': return this._discard.length;
      default: return 0;
    }
  }

  reshuffle() {
    this._draw = this._draw.concat(Util.shuffle(this._discard));
    this._discard = [];
  }

  draw(n) {
    n = n || 1;
    if (this._draw.length + this._discard.length < n) return null;
    if (this._draw.length < n) this.reshuffle();
    if (n == 1) return this._draw.pop();
    let cards = this._draw.slice(0, n);
    this._draw.splice(0, n);
    return cards;
  }

  discard(c) {
    if (c instanceof Array) {
      this._discard = this._discard.concat(c);
    } else {
      this._discard.push(c);
    }
  }
}

class EncounterEntity {
  _resources = { [RES.LIFE]: { current: 0, max: 0 }, [RES.MANA]: { current: 0, max: 0 } };
  deck;
  hand;
  gear;
  debuffs;
  
  constructor({ resources, cards, gear }) {
    Object.assign(this._resources, resources);
    this.deck = new EncounterDeck(cards);
    this.hand = [];
    this.gear = gear;
    this.debuffs = { stun: 0 }
  }

  get life() { return this._resources[RES.LIFE].current }
  get maxLife() { return this._resources[RES.LIFE].max }
  set life(v) { this._resources[RES.LIFE].current = Util.clamp(v, 0, this.maxLife); }

  get mana() { return this._resources[RES.MANA].current }
  get maxMana() { return this._resources[RES.MANA].max }
  set mana(v) { this._resources[RES.MANA].current = Util.clamp(v, 0, this.maxMana); }

  get speed() { return 1; }

  drawCard() {
    let card;
    if (card = this.deck.draw()) this.hand.push(card);
    return card;
  }
  
  discardCard(c) {
    let idx = this.hand.indexOf(c);
    if (idx < 0) throw 'Can\'t discard a card not in hand!'
    let card = this.hand[idx];
    this.hand.splice(idx, 1);
    this.deck.discard(c);
  }

  applyDebuff(k, n) {
    this.debuffs[k] = (this.debuffs[k] || 0) + n;
  }

  applyDamage(magnitude, type) {
    this.life -= magnitude;
  }

  applyRestore(magnitude, resource) {
    this._resources[resource].current = Util.clamp(
      this._resources[resource].current + magnitude,
      0,
      this._resources[resource].max
    );
  }
}

class Encounter {
  entities;
  gameLoop;

  _player;
  _enemy;

  constructor({ player, enemy, end, animate, redraw }) {
    this.redraw = redraw;
    this.animate = animate;
    this.end = end;

    this.entities = {
      player: new EncounterEntity({
         cards: player.deck || [],
         resources: {
           [RES.LIFE]: { current: player.life, max: player.life },
           [RES.MANA]: { current: player.mana, max: player.life }
        }}),
      enemy: new EncounterEntity({
         cards: enemy.deck || [],
         resources: {
           [RES.LIFE]: { current: enemy.life, max: enemy.life },
           [RES.MANA]: { current: enemy.mana, max: enemy.life }
        }
      }),
    }

    this._player = player;
    this._enemy = enemy;

    let loopCycle = [
      ES.PLAYER_TURN,
      ES.PLAYER_DRAW,
      ...Util.genArray(this.entities.player.speed, () => ES.PLAYER_PLAY),
      ES.ENEMY_TURN,
      ES.ENEMY_DRAW,
      ...Util.genArray(this.entities.enemy.speed, () => ES.ENEMY_PLAY)
    ];

    this.gameLoop = new GameLoop(loopCycle, ES.BEGIN, (s) => this.handleGameState(s));

    this.gameLoop.nextState(); // BEGIN
    this.gameLoop.nextState(); // Progress to what's next
  }

  get truePlayer() { return this._player; }
  get trueEnemy() { return this._enemy; }

  get gameState() { return this.gameLoop.state; }
  nextGameState() { this.gameLoop.nextState(); }
  queueGameState(...args) { this.gameLoop.queueState(...args); }

  handleGameState(state) {
    if (this.entities.player.life == 0 || this.entities.enemy.life == 0) {
      let playerWin = this.entities.enemy.life == 0;
      this.gameLoop.setState(playerWin ? ES.PLAYER_WIN : ES.PLAYER_LOSE);
      this.animate(playerWin ? 'player-win' : 'player-lose');
      this.end[playerWin ? 'win' : 'lose']();
      return;
    }

    switch (state) {
      case ES.BEGIN:
        this.beginEncounter();
        break;
      case ES.PLAYER_DRAW:
        this.gameEvent('player-draw-card');
        break;
      case ES.PLAYER_DISCARD:
        if (this.entities.player.hand.length == 0) this.nextGameState();
        break;
      case ES.PLAYER_TURN:
      case ES.ENEMY_TURN:
        this.beginTurn(state == ES.PLAYER_TURN ? CS.PLAYER : CS.ENEMY);
        break;
      case ES.ENEMY_DRAW:
      case ES.ENEMY_PLAY:
        this.enemyGameState(state);
        break;
    }
  }

  enemyGameState(state) {
    let enemyGameEvent = (e, args) => {
      let event = 'enemy-' + e;
      window.setTimeout(() => {
        this.gameEvent(event, args);
        this.redraw();
      }, 200);
    };
    switch (state) {
      case ES.ENEMY_DRAW:
        enemyGameEvent('draw-card');
        break;
      case ES.ENEMY_PLAY:
        this._enemy.takeTurn({
          hand: this.entities.enemy.hand,
          life: this.entities.enemy.life,
          mana: this.entities.enemy.mana,
          gameEvent: enemyGameEvent
        });
        break;
    }
  }

  gameEvent(event, args) {
    let force = args && args.force;
    let animate = false;
    switch (event) {
      case 'player-draw-card':
        if (this.gameState == ES.PLAYER_DRAW || force) {
          animate = true;
          let card = this.entities.player.drawCard()
          this.handleCard(card, CS.PLAYER, CM.DRAW);
          if (this.gameState == ES.PLAYER_DRAW && !force) this.nextGameState();
        }
        break;
      case 'player-play-card':
        if (this.gameState == ES.PLAYER_PLAY || force) {
          let mana = args.card.mana || 0;
          if (this.entities.player.mana >= mana || force) {
            animate = true;
            this.entities.player.discardCard(args.card);
            this.entities.player.mana -= mana;
            this.handleCard(args.card, CS.PLAYER, CM.PLAY);
            if (this.gameState == ES.PLAYER_PLAY && !force) this.nextGameState();
          }
        }
        break;
      case 'player-discard-card':
        if (this.gameState == ES.PLAYER_DISCARD || force) {
          animate = true;
          this.entities.player.discardCard(args.card);
          if (this.gameState == ES.PLAYER_DISCARD && !force) this.nextGameState();
        }
        break;
      case 'player-pass':
        // TODO: doesn't support passing queued plays
        if (this.gameState == ES.PLAYER_PLAY || force) {
          this.gameLoop.cycleIndex = this.gameLoop.stateCycle.indexOf(ES.ENEMY_TURN);
          this.nextGameState();
        }
        break;

      case 'enemy-draw-card':
        if (this.gameState == ES.ENEMY_DRAW || force) {
          let card = this.entities.enemy.drawCard()
          this.handleCard(card, CS.ENEMY, CM.DRAW);
          if (this.gameState == ES.ENEMY_DRAW && !force) this.nextGameState();
        }
        break;
      case 'enemy-pass':
        if (this.gameState == ES.ENEMY_PLAY && !force) this.nextGameState();
        break;
      case 'enemy-play-card':
        if (this.gameState == ES.ENEMY_PLAY || force) {
          let mana = args.card.mana || 0;
          if (this.entities.enemy.mana >= mana || force) {
            animate = true;
            this.entities.enemy.discardCard(args.card);
            this.entities.enemy.mana -= mana;
            this.handleCard(args.card, CS.ENEMY, CM.PLAY);
            if (this.gameState == ES.ENEMY_PLAY && !force) this.nextGameState();
          }
        }
        break;

      default:
        throw `Unknown game event! '${event}'`;
    }

    if (animate && this.animate) this.animate(event, args);
    this.redraw();
  }

  handleCard(card, source, method) {
    let target;
    if (method == CM.DRAW) {
      if (card.affixes.some(a => a.action === AA.AUTOPLAY)) {
        let evtPrefix = source == CS.PLAYER ? 'player-' : 'enemy-';
        let playEvt = evtPrefix + 'play-card';
        let drawEvt = evtPrefix + 'draw-card';
        this.delay(() => {
          this.gameEvent(playEvt, { card: card, force: true });
          window.setTimeout(() => this.gameEvent(drawEvt), 200);
          this.redraw();
        }, 750);
      }
    } else if (method == CM.PLAY) {
      card.affixes.forEach(affix => {
        target = null;
        switch (affix.action) {
          case AA.ATTACK:
            target = (source == CS.PLAYER) ? this.entities.enemy : this.entities.player;
            target.applyDamage(affix.magnitude, affix.spec.type);
            break;
          case AA.RESTORE:
            target = (source == CS.PLAYER) ? this.entities.player : this.entities.enemy;
            target.applyRestore(affix.magnitude, affix.spec.resource);
            break;
          case AA.DRAW:
            target = (source == CS.PLAYER) ? this.entities.player : this.entities.enemy;
            this.gameEvent('player-draw-card', { force: true });
            break;
          case AA.DISCARD:
            for (var i = 0; i < affix.magnitude; i++) {
              this.gameLoop.queueState((source == CS.PLAYER) ? ES.PLAYER_DISCARD : ES.ENEMY_DISCARD);
            }
            break;
          case AA.STUN:
            let turn = (source == CS.PLAYER) ? ES.ENEMY_PLAY : ES.PLAYER_PLAY;
            target = (source == CS.PLAYER) ? this.entities.enemy : this.entities.player;
        }
      });
    }
  }

  beginEncounter() {
    // -1 is because we'll draw at the start of the first turn anyway
    let initial = Rules.STARTING_HAND_SIZE - 1;
    for (var i = 0; i < initial; i++) {
      this.entities.player.drawCard();
    }
  }

  beginTurn(side) {
    let target = side == CS.PLAYER ? this.entities.player : this.entities.enemy;
    target.applyRestore(1, RES.MANA);
    window.setTimeout(() => {
      this.nextGameState();
      this.redraw();
    }, 200);
  }

  delay(f, t) {
    window.setTimeout(f, t);
  }


  get canPlay() { return this.gameState == ES.PLAYER_PLAY; }
  get canDiscard() { return this.gameState == ES.PLAYER_DISCARD; }
  get canDraw() { return this.gameState == ES.PLAYER_DRAW; }

}

export default Encounter;