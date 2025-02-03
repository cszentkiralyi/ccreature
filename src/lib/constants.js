const gen_enum = (vs, target) => {
  let ret = target || {};
  for (var i = 0; i < vs.length; i++) {
    ret[vs[i]] = i;
  }
  let byVal = ret.byVal || {};
  vs.forEach(v => byVal[ret[v]] = v);
  ret.byVal = byVal;
  return ret;
}

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
  ]),

  AFFIX_POSITION: gen_enum(['PREFIX', 'SUFFIX']),

  DAMAGE_TYPE: gen_enum(['PHYSICAL', 'ELEMENTAL', 'DARK']),

  ENCOUNTER_STATE: gen_enum([
    'BEGIN',
    'PLAYER_DRAW',
    'PLAYER_PLAY',
    'AI_DRAW',
    'AI_PLAY',
    'PLAYER_WIN',
    'PLAYER_LOSE'
  ]),

  RARITY: gen_enum(['COMMON', 'MAGIC', 'RARE']),

  RESOURCE: gen_enum(['LIFE', 'MANA']),
};

Constants.gen_enum = gen_enum;

export default Constants;