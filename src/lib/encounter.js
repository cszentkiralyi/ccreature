import Constants from './constants.js';
import Util from './util.js';

const ES = Constants.ENCOUNTER_STATE;
const AA = Constants.AFFIX_ACTION;
const RES = Constants.RESOURCE;

const CS = Constants.gen_enum([ 'PLAYER', 'ENEMY' ]);
const CM = Constants.gen_enum([ 'PLAY', 'DRAW' ]);

class GameEventHandler {
  state = 'idle';
  resumeState = null;
  stateCycle = [];
  stateQueue = [];
  nextState() {
    let next;
    if (this.stateQueue.length > 1) {
      this.state = this.stateQueue.pop();
    } else if (this.stateQueue == 1) {
      this.state = this.stateQueue.pop();
      this.resumeState = this.resumeState || this.stateCycle[0];
    } else if (this.resumeState != null) {
      this.state = this.resumeState;
      this.resumeState = null;
    } else if ((next = this.stateCycle.indexOf(this.state)) > -1) {
      next++;
      if (next >= this.stateCycle.length) next = 0;
      this.state = this.stateCycle[next];
    } else {
      this.state = this.stateCycle[0];
    }
    this.handleState(this.state);
  }
  handleState(newState) { }
  queueState(state) { this.stateQueue.push(state); }
  gameEvent(event, args, redraw) { redraw(); }
}

class EncounterDeck {
  _cards;
  _draw;
  _discard;

  constructor(cards) {
    this._cards = cards;
    this._draw = Util.shuffle(cards);
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
  // [current, max]
  _resources = { [RES.LIFE]: [0, 0], [RES.MANA]: [0, 0] };
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

  get life() { return this._resources[RES.LIFE][0] }
  get maxLife() { return this._resources[RES.LIFE][1] }
  set life(v) { this._resources[RES.LIFE][0] = Util.clamp(v, 0, this.maxLife); }

  get mana() { return this._resources[RES.MANA][0] }
  get maxMana() { return this._resources[RES.MANA][1] }
  set mana(v) { this._resources[RES.MANA][0] = Util.clamp(v, 0, this.maxMana); }

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

  applyDamage(magnitude, damage) {
    this.life -= magnitude;
  }

  applyRestore(magnitude, resource) {
    this._resources[resource][0] = Util.clamp(
      this._resources[resource][0] + magnitude,
      0,
      this._resources[resource][1]
    );
  }
}

class Encounter extends GameEventHandler {
  entities;

  state = ES.BEGIN;
  stateCycle = [ ES.PLAYER_PLAY, ES.PLAYER_DRAW ];

  constructor({ playerCards }) {
    super();
    this.entities = {
      'player': new EncounterEntity({
         cards: playerCards || [],
         resources: { [RES.LIFE]: [10, 10], [RES.MANA]: [10, 10] }}),
      'enemy': new EncounterEntity({
         cards: [],
         resources: { [RES.LIFE]: [500, 500] }}),
    }

    this.state = ES.BEGIN;
    this.handleState(this.state);
    this.nextState();
  }

  handleState(state) {
    if (this.entities.player.life == 0 || this.entities.enemy.life == 0) {
      this.state = (this.entities.enemy.life == 0) ? ES.PLAYER_WIN : ES.PLAYER_LOSE;
      return;
    }

    switch (state) {
      case ES.BEGIN:
        this.beginEncounter();
        break;
    }
  }

  gameEvent(event, args, redraw) {
    let force = args && args.force;
    switch (event) {
      case 'player-draw-card':
        if (this.state == ES.PLAYER_DRAW || force) {
          let card = this.entities.player.drawCard()
          this.handleCard(card, CS.PLAYER, CM.DRAW);
          if (!force) this.nextState();
          if (redraw) redraw();
        }
        break;
      case 'player-play-card':
        if (this.state == ES.PLAYER_PLAY || force) {
          let mana = args.card.mana || 0;
          if (this.entities.player.mana >= mana || force) {
            this.entities.player.discardCard(args.card);
            this.entities.player.mana -= mana;
            this.handleCard(args.card, CS.PLAYER, CM.PLAY);
            if (!force) this.nextState();
          }
        }
        break;
    }
  }

  handleCard(card, source, method) {
    let target;
    if (method == CM.DRAW) {
      if (card.affixes.some(a => a.action === AA.AUTOPLAY)) {
        this.delay(() => this.gameEvent('player-play-card', { card: card, force: true }), 750);
      }
    } else if (method == CM.PLAY) {
      card.affixes.forEach(affix => {
        target = null;
        switch (affix.action) {
          case AA.ATTACK:
            target = (source == CS.PLAYER) ? this.entities.enemy : this.entities.player;
            target.applyDamage(affix.magnitude, affix.data.damage);
            break;
          case AA.RESTORE:
            target = (source == CS.PLAYER) ? this.entities.player : this.entities.enemy;
            target.applyRestore(affix.magnitude, affix.data.resource);
            break;
          case AA.DRAW:
            target = (source == CS.PLAYER) ? this.entities.player : this.entities.enemy;
            this.gameEvent('player-draw-card', { force: true });
            break;
        }
      });
    }
  }

  beginEncounter() {
    for (var i = 0; i < 3; i++) {
      this.entities.player.drawCard();
    }
  }

  delay(f, t) {
    window.setTimeout(f, t);
  }
}

export { Encounter };