const captialize = (s) => {
  if (!s || !(typeof s === 'string') || s.length == 0) return null;
  if (s.length == 1) return s.toUpperCase();

  return `${s.slice(0, 1).toUpperCase()}${s.slice(1, s.length).toLowerCase()}`;
};

/** Returns an array of elements of els in a random order */
const shuffle = (els) => {
  return els.map(e => ({ e: e, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(e => e.e);
}

/** Clamp v within the range [top, bot] */ 
const clamp = (v, bot, top) => (v > top) 
  ? top 
  : (v < bot)
    ? bot
    : v;

/** rng(n) rolls a fair n-sided die
 * 
 * rng(n, m) rolls fairly in the range [n, m]
 */
const rng = (n, m) => {
  if (!m) {
    return 1 + Math.floor(Math.random() * n);
  } else {
    let r = 1 + m - n;
    return n + Math.floor(Math.random() * r);
  }
} 

/** opts : [{ weight: N }, ...]
 * 
 * Returns one opt, chosen at random based on weight; other properties
 * of opt are preserved so attach values etc as needed */
const wrng = (opts) => {
  let totalWeight = opts.reduce((t, o) => t + o.weight, 0);
  let roll = Math.floor(Math.random() * totalWeight);
  let sum = 0, i;
  for (i in opts.sort((a, b) => a.weight - b.weight)) {
    let o = opts[i];
    sum += o.weight;
    if (roll < sum) return o;
  }
};

/** Interpolates the range [a, b] to the point t in [0, 1] */
const interp = (a, b, t) => a + (t * (b - a));

const identity = (x) => x;

const groupBy = (coll, f) => {
  return coll.reduce((m, e) => {
    let k = f(e);
    m[k] = m[k] || [];
    m[k].push(e);
    return m;
  }, {});
}

export default {
  captialize,
  shuffle,
  clamp,
  rng,
  wrng,
  interp,
  identity,
  groupBy,
 };