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
  data;

  constructor(position, titles, { action, magnitude, data }) {
    if (typeof AA.byVal[action] === 'undefined') throw `Illegal action value '${action}'`;
    this.position = position;
    this.titles = titles;
    this.action = action;
    this.magnitude = magnitude;
    this.data = data;
  }

  toString() {
    return [
      Util.captialize(AA.byVal[this.action]),
      this.magnitude,
      Affix.actionDataString(this.action, this.data)
    ].filter(s => s != null).join(' ');
  }

  static actionDataString(action, data) {
    switch (action) {
      case AA.ATTACK:
        return Util.captialize(DMG.byVal[data.damage]);
      case AA.RESTORE:
        return Util.captialize(RES.byVal[data.resource]);
    }
  }

  static parse(s) {
    let tokens = s.split(' ');
    let [actionStr, magnitude, ...misc] = tokens;
    let data = null;
    let action = AA[actionStr.toUpperCase()];
    if (magnitude) magnitude = parseInt(magnitude, 10);
    if (misc.length > 0) data = this.parseActionData(action, misc);
    return { action, magnitude, data };
  }

  static parseActionData(action, misc) {
    switch (action) {
      case AA.ATTACK:
        return {
          damage: DMG[misc[0].toUpperCase()]
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