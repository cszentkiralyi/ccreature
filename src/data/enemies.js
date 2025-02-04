import Constants from '../lib/constants.js';
import Util from '../lib/constants.js';

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
  _levelBonus = {
    resource: { life: 1, mana: 1 }
  }

  constructor(level) {
    this.level = level;
  }

  takeTurn({ hand, life, mana, gameEvent }) { gameEvent('pass'); }

  get life() {
    return this._base.resource.life + Math.floor(this.level * this._levelBonus.resource.life);
  }
  get mana() {
    return this._base.resource.mana + Math.floor(this.level * this._levelBonus.resource.mana);
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
  constructor(level) {
    super(level);
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