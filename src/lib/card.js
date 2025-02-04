import Constants from './constants.js';
import Util from './util.js';
import Affix from './affix.js';
import AffixGen from '../data/affixes.js';

const AP = Constants.AFFIX_POSITION;
const R = Constants.RARITY

class Card {
  static AFFIX_LIMIT = 4;

  affixes;
  rarity;
  mana;

  constructor({ rarity, ...opts }) {
    this.rarity = rarity;
    this.affixes = (opts && opts.affixes) || [];
    this.mana = (opts && opts.mana) || 0;
  }

  get affixes() { return [...this.affixes]; }

  addAffix(affix) {
    if (this.affixes.length === Card.AFFIX_LIMIT) return false;
    this.affixes.push(affix);
    return true;
  }

  removeAffix(x) {
    let affixes = this.affixes;
    let next = affixes;
    if (typeof x === 'string') {
      next = affixes.filter(a => a.label !== x);
    } else if (x instanceof Affix) {
      next = affixes.filter(a => a !== x);
    }

    if (next !== affixes) {
      this.affixes = next;
      return true
    }

    return false;
  }

  get prefixes() {
    return this.affixes.filter(a => a.position === AP.PREFIX);
  }

  get suffixes() {
    return this.affixes.filter(a => a.position === AP.SUFFIX);
  }

  get title() {
    let [prefixes, suffixes] =
      this.affixes.reduce(([p, s], a) => {
        if (a.position === AP.PREFIX) {
          p = p.concat([a]);
        } else {
          s = s.concat([a]);
        }
        return [p, s];
      }, [[],[]]);
    prefixes = prefixes.sort((a, b) => Card.sortAffix(this.affixes, a, b));
    suffixes = suffixes.sort((a, b) => Card.sortAffix(this.affixes, a, b));

    /*
         P: Strike
        PP: Warrior's Strike
        PS: Strike of Calm
       PPS: Warrior's Strike of Calm
      PPSS: Warrior's Strike of Calm Resolve
    */

    let t = '';
    if (prefixes.length == 2) t = prefixes[1].titles[0] + ' ';
    if (prefixes.length > 0) t += prefixes[0].titles[1] + ' ';
    if (suffixes.length == 1) {
      t += suffixes[0].titles[1];
    } else {
      t += suffixes.reverse().map((s, i) => s.titles[i]).reverse().join(' ')
    }
    return t.trim();
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

  static generate() {
    let rarity = Util.wrng([
      { value: R.COMMON, weight: 100 },
      { value: R.MAGIC, weight: 50 },
      { value: R.RARE, weight: 15 }
    ]).value;

    let affixCount = 1; // Common
    switch (rarity) {
      case R.MAGIC:
        affixCount = Util.wrng([{ value: 1, weight: 2 }, { value: 2, weight: 1 }]).value;
        break;
      case R.RARE:
        affixCount = Util.wrng([
          { value: 2, weight: 7 },
          { value: 3, weight: 5 },
          { value: 4, weight: 2 }
        ]).value;
        break;
    }

    let card = new Card({ rarity: rarity }), i;
    for (i = 0; i < affixCount; i++) {
      let affixFilter = { inst: card.affixes };
      if (card.suffixes.length == 2) {
        affixFilter.position = [AP.SUFFIX];
      } else if (card.prefixes.length == 2) {
        affixFilter.position = [AP.PREFIX];
      }
      let affixData = AffixGen.generateAffixExcluding(affixFilter);
      let affix = new Affix(affixData.position, affixData.titles, affixData.spec);
      card.addAffix(affix);
    }

    card.mana = 1;

    return card;
  }
}

export default Card;