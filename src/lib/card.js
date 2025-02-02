import { Constants } from './constants.js';

const AP = Constants.AFFIX_POSITION;

class Affix {
  titles;
  position;
  action;
  magnitude;
  target;

  constructor(position, titles, { action, magnitude, target }) {
    this.position = position;
    this.titles = titles;
    this.action = action;
    this.magnitude = magnitude;
    this.target = target;
  }

}

const AFFIXES = {
  attack: [
    new Affix(AP.PREFIX, ['Warrior\'s', 'Strike' ], { action: 'attack', magnitude: 10 })
  ]
};


class Card {
  static AFFIX_LIMIT = 4;

  _affixes;

  constructor({ affixes }) {
    this._affixes = affixes || [];
  }

  addAffix(affix) {
    if (this._affixes.length === Card.AFFIX_LIMIT) return false;
    this._affixes = this._affixes.append(affix);
    return true;
  }

  removeAffix(x) {
    if (typeof x === 'string') {
      this._affixes = this._affixes.filter(a => a.label === x);
      return true;
    }

    return false;
  }

  get title() {
    let [prefixes, suffixes] =
      this._affixes.reduce(([p, s], a) => {
        console.log([p, s]);
        if (a.position === AP.PREFIX) {
          p = p.concat([a]);
        } else {
          s = s.concat([a]);
        }
        return [p, s];
      }, [[],[]]);
    prefixes = prefixes.sort((a, b) => Card.sortAffix(this._affixes, a, b));
    suffixes = suffixes.sort((a, b) => Card.sortAffix(this._affixes, a, b));

    /*
         P: Strike
        PP: Warrior's Strike
        PS: Strike of Calm
       PPS: Warrior's Strike of Calm
      PPSS: Warrior's Strike of Calm Resolve
    */

    let t = '';
    console.log(prefixes, suffixes, this._affixes);
    if (prefixes.length == 2) t = prefixes[1].titles[0] + ' ';
    t += prefixes[0].titles[1];
    t += ' ' + suffixes.map((s, i) => s.titles[i]).join(' ');
    return t;
  }

  static sortAffix(affixes, a, b) {
    if (a.position === b.position) {
      return (affixes.indexOf(a) < affixes.indexOf(b)) ? 1 : -1;
    } else if (b.position === AP.SUFFIX) {
      return 1;
    } else {
      return -1;
    }
  }
}

export { Affix, Card, AFFIXES };