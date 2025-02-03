const LEVEL_COEFFICIENT = 0.75;

class Archetype {
  experience;
  deck;

  _base = {
    attributes: { str: 0, dex: 0, int: 0},
    resources: { life: 10, mana: 10 },
    deckSize: { min: 12, max: 12 }
  }
  _bonuses = {
    attributes: { str: 0, dex: 0, int: 0 },
    resources: { life: 2, mana: 2 },
    deckSize: { min: 0, max: 1 }
  };

  constructor() {
    this.experience = 0;
    this.deck = [];
  }

  get level() {
    return Math.floor(LEVEL_COEFFICIENT * Math.sqrt(this.experience));
  }

  get life() {
    return this._base.resources.life + Math.floor(this.level * this._bonuses.resources.life);
  }
  get mana() {
    return this._base.resources.mana + Math.floor(this.level * this._bonuses.resources.mana);
  }

  get str() {
    return this._base.attributes.str + Math.floor(this.level * this._bonuses.attributes.str);
  }
  get dex() {
    return this._base.attributes.dex + Math.floor(this.level * this._bonuses.attributes.dex);
  }
  get int() {
    return this._base.attributes.int + Math.floor(this.level * this._bonuses.attributes.int);
  }
  get attributes() {
    return {
      str: this.str,
      dex: this.dex,
      int: this.int
    };
  }

  get deckSize() {
    return {
      min: this._base.deckSize.min + Math.floor(this.level * this._bonuses.deckSize.min),
      max: this._base.deckSize.max + Math.floor(this.level * this._bonuses.deckSize.max)
    };
  }
}

class TheMeat extends Archetype {
  constructor() {
    super();
    this._levelBonuses.resources.life = 4;
    this._levelBonuses.attributes.str = 1;
    this._levelBonuses.deckSize.min = -0.5;
  }
}

class TheHands extends Archetype {
  constructor() {
    super();
    this._levelBonuses.resources = { life: 3, mana: 3 };
    this._levelBonuses.attributes.dex = 1;
  }
}

class TheBrain extends Archetype {
  constructor() {
    super();
    this._levelBonuses.resources.mana = 4;
    this._levelBonuses.attributes.int = 1;
    this._levelBonuses.deckSize.maxa = 0.5;
  }
}

export default {
  Archetype,
  TheMeat,
  TheHands,
  TheBrain
};