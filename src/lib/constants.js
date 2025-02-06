const gen_enum = (vs, target, getEnumValue) => {
  let enumV = getEnumValue || ((i) => i);
  let ret = target || {};
  let byVal = ret.byVal || {};
  let i, e, v;
  for (i = 0; i < vs.length; i++) {
    v = vs[i];
    e = enumV(i);
    ret[v] = e;
    byVal[e] = v;
  }
  ret.byVal = byVal;
  return ret;
}

/** Return a true bitflag enum so you can do stuff like (ENUM.A | ENUM.B)
 *  to represent both A and B simultaneously, and check via (v & ENUM.A) */
const gen_bit_enum = (vs, target) => gen_enum(vs, target, (i) => Math.pow(2, i));

const Constants = {
  AFFIX_ACTION: gen_enum([
    'ATTACK',
    'SPELL',
    'RESTORE',
    'RESIST',
    'STUN',
    'AFFLICT',
    'SLOW',
    'AUTOPLAY',
    'SPEED',
    'AREA',
    'DRAW',
    'DISCARD',
  ]),

  AFFIX_POSITION: gen_enum(['PREFIX', 'SUFFIX']),

  DAMAGE_TYPE: gen_enum(['PHYSICAL', 'ELEMENTAL', 'DARK']),

  ENCOUNTER_STATE: gen_enum([
    'BEGIN',
    'PLAYER_TURN',
    'PLAYER_DRAW',
    'PLAYER_PLAY',
    'PLAYER_DISCARD',
    'ENEMY_TURN',
    'ENEMY_DRAW',
    'ENEMY_PLAY',
    'ENEMY_DISCARD',
    'PLAYER_WIN',
    'PLAYER_LOSE'
  ]),

  RARITY: gen_enum(['COMMON', 'MAGIC', 'RARE']),

  RESOURCE: gen_enum(['LIFE', 'MANA']),
};

Constants.gen_enum = gen_enum;

export default Constants;