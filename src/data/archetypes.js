const LEVEL_COEFFICIENT = 0.75;

import Card from '../lib/card.js';

class Archetype {
  experience;
  deck;

  _base = {
    attribute: { str: 0, dex: 0, int: 0},
    resource: { life: 10, mana: 10 },
    deckSize: { min: 12, max: 12 }
  }
  _levelBonus = {
    attribute: { str: 0, dex: 0, int: 0 },
    resource: { life: 2, mana: 2 },
    deckSize: { min: 0, max: 1 }
  };

  constructor() {
    this.experience = 0;
    this.deck = [];
  }

  get level() {
    return Math.floor(LEVEL_COEFFICIENT * Math.sqrt(this.experience));
  }

  // TODO: update these to reference Constants.RESOURCE & Constants.ATTRIBUTE maybe
  get life() {
    return this._base.resource.life + Math.floor(this.level * this._levelBonus.resource.life);
  }
  get mana() {
    return this._base.resource.mana + Math.floor(this.level * this._levelBonus.resource.mana);
  }

  get str() {
    return this._base.attribute.str + Math.floor(this.level * this._levelBonus.attribute.str);
  }
  get dex() {
    return this._base.attribute.dex + Math.floor(this.level * this._levelBonus.attribute.dex);
  }
  get int() {
    return this._base.attribute.int + Math.floor(this.level * this._levelBonus.attribute.int);
  }
  get attribute() {
    return {
      str: this.str,
      dex: this.dex,
      int: this.int
    };
  }

  get deckSize() {
    return {
      min: this._base.deckSize.min + Math.floor(this.level * this._levelBonus.deckSize.min),
      max: this._base.deckSize.max + Math.floor(this.level * this._levelBonus.deckSize.max)
    };
  }
}

class TheMeat extends Archetype {
  constructor() {
    super();
    this._levelBonus.resource.life = 4;
    this._levelBonus.attribute.str = 1;
    this._levelBonus.deckSize = { min: -0.25, max: 0.5 };

    this.deck = [
      { count: 8,
        card: Card.parse(`Strike
          Common
          Attack 3 Physical [attack, physical]`) },
      { count: 2,
        card: Card.parse(`Analyze
          Common
          Restore 4 Mana [mana]`) },
      { count: 2,
        card: Card.parse(`Train
          Common
          Restore 2 Life [life]`)}
    ];
  }
}

class TheHands extends Archetype {
  constructor() {
    super();
    this._levelBonus.resource = { life: 3, mana: 3 };
    this._levelBonus.attribute.dex = 1;
  }
}

class TheBrain extends Archetype {
  constructor() {
    super();
    this._levelBonus.resource.mana = 4;
    this._levelBonus.attribute.int = 1;
    this._levelBonus.deckSize.maxa = 0.5;
  }
}

export default {
  Archetype,
  TheMeat,
  TheHands,
  TheBrain
};