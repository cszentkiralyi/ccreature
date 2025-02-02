import Constants from './constants.js';
import Util from './util.js';

const ES = Constants.ENCOUNTER_STATE;

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
  _resources = { life: [0, 0], mana: [0, 0] };
  deck;
  hand;
  gear;
  debuffs;
  
  constructor({ resources, cards, gear }) {
    this._resources = {};
    Object.keys(resources).forEach(k => this._resources[k] = [...resources[k]]);
    this.deck = new EncounterDeck(cards);
    this.hand = [];
    this.gear = gear;
    this.debuffs = { stun: 0 }
  }

  get life() { return this._resources.life[0] }
  get maxLife() { return this._resources.life[1] }
  set life(v) { this._resources.life[0] = Util.clamp(this.life + v, 0, this.maxLife); }

  get mana() { return this._resources.mana[0] }
  get maxMana() { return this._resources.mana[1] }
  set mana(v) { this._resources.mana[0] = Util.clamp(this.mana + v, 0, this.maxMana); }

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
}

class Encounter {
  entities;
  _state;

  constructor({ playerCards }) {
    this.entities = {
      'player': new EncounterEntity({ cards: playerCards || [], resources: { life: [10, 10] }}),
      'enemy': new EncounterEntity({ cards: [], resources: { life: [10, 10] }}),
    }

    this._state = ES.BEGIN;

    for (var i = 0; i < 3; i++) {
      this.entities.player.drawCard();
    }

    this._state = ES.PLAYER_PLAY;
  }

  nextPhase() {
    let next = null;
    if (this.entities.player.life == 0 || this.entities.enemy.life == 0) {
      next = (this.entities.player.mana == 0) ? EP.PLAYER_WIN : EP.PLAYER_LOSE;
    } else {
      switch (this._state) {
        case EP.PLAYER_PLAY:
          next = EP.PLAYER_DRAW;
      }
    }
    if (this._state !== next && next != null) this._state = next;
  }
}

export { Encounter };