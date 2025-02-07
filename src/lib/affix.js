import Constants from './constants.js';
import Util from './util.js';

const AA = Constants.AFFIX_ACTION;
const DMG = Constants.DAMAGE_TYPE;
const RES = Constants.RESOURCE;

class Affix {
  base;
  titles;
  position;
  action;
  magnitude;
  spec;

  constructor(position, titles, { action, magnitude, spec }) {
    if (typeof AA.byVal[action] === 'undefined') throw `Illegal action value '${action}'`;
    this.position = position;
    this.titles = titles;
    this.action = action;
    this.magnitude = magnitude;
    this.spec = spec;
  }

  toString() {
    return [
      Util.captialize(AA.byVal[this.action]),
      this.magnitude,
      Affix.actionString(this.action, this.spec)
    ].filter(s => s != null).join(' ');
  }

  static actionString(action, spec) {
    switch (action) {
      case AA.ATTACK:
        return Util.captialize(DMG.byVal[spec.type]);
      case AA.RESTORE:
        return Util.captialize(RES.byVal[spec.resource]);
    }
  }

  static parse(s) {
    let tokens = s.split(' ');
    let [actionStr, magnitude, ...misc] = tokens;
    let spec = null;
    let action = AA[actionStr.toUpperCase()];
    if (magnitude) magnitude = parseInt(magnitude, 10);
    if (misc.length > 0) spec = this.parseActionSpec(action, misc);
    return { action, magnitude, spec };
  }

  static parseActionSpec(action, misc) {
    switch (action) {
      case AA.ATTACK:
        return {
          type: DMG[misc[0].toUpperCase()]
        }
      case AA.RESTORE:
        return {
          resource: RES[misc[0].toUpperCase()]
        }
    }
    return null;
  }

}

export default Affix;