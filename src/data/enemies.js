import Constants from '../lib/constants.js';
import Util from '../lib/util.js';
import Card from '../lib/card.js';

const ENEMY_KIND = Constants.gen_enum([ 'RABBLE', 'ELITE', 'BOSS' ]);

class EnemyArchetype {
  level;
  kind;
  deck;
  speed;

  _base = {
    resource: { life: 10, mana: 10 }
  };

  // TODO: replace with scaling algo
  _scaling = {
    resource: { life: 1, mana: 1 }
  };

  _lootTable = [
    { cards: 0, weight: 1 }
  ];

  constructor(level) {
    this.level = level;
  }

  takeTurn({ hand, life, mana, gameEvent }) { gameEvent('pass'); }

  getLoot(bonus, force) {
    if (this._loot && !force) return this._loot;
    // TODO: care about the loot bonus, for now it's a placeholder
    let roll = Util.wrng(this._lootTable);
    this._loot = Util.genArray(roll.cards, () => Card.generate(this.level));
    return this._loot
  }

  get life() {
    return this._base.resource.life + Math.floor(this.level * this._scaling.resource.life);
  }
  get mana() {
    return this._base.resource.mana + Math.floor(this.level * this._scaling.resource.mana);
  }

  static create(kind, level) {
    let c;

    switch (kind) {
      case ENEMY_KIND.RABBLE:
        c = EnemyRabble;
        break;
      case ENEMY_KIND.ELITE:
        c = EnemyElite;
        break;
      case ENEMY_KIND.BOSS:
        c = EnemyBoss;
        break;
    }

    return new c(level);
  }

}

class EnemyRabble extends EnemyArchetype {
  _base = {
    resource: { life: 5, mana: 10 }
  };

  _lootTable = [
    { cards: 0, weight: 10 },
    { cards: 1, weight: 10 },
    { cards: 2, weight: 5 },
    { cards: 3, weight: 1 }
  ];

  constructor(level) {
    super(level);

    this.deck = [
      { count: 8,
        card: Card.parse(`Fear
          Common
          Attack 2 Physical`) },
      { count: 2,
        card: Card.parse(`Recover
          Common
          Restore 4 Mana`) }
    ];
  }

  takeTurn({ hand, life, mana, gameEvent }) {
    if (hand.length > 0) {
      gameEvent('play-card', { card: hand[0] });
    } else {
      gameEvent('pass');
    }
  }
}

class EnemyElite extends EnemyArchetype {
  constructor(level) {
    super(level);
  }
}

class EnemyBoss extends EnemyArchetype {
  constructor(level) {
    super(level);
  }
}

export default {
  EnemyArchetype,
  EnemyRabble,
  EnemyElite,
  EnemyBoss,
  ENEMY_KIND
};