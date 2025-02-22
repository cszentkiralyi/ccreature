import Constants from './constants.js';
import Util from './util.js';

const AA = Constants.AFFIX_ACTION;
const DMG = Constants.DAMAGE_TYPE;
const RES = Constants.RESOURCE;

class Affix {
  titles;
  position;
  action;
  magnitude;
  spec;

  constructor(props) {
    if (typeof AA.byVal[props.action] === 'undefined') throw `Illegal action value '${props.action}'`;
    Object.assign(this, props);
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
      case AA.SPELL:
        return Util.captialize(DMG.byVal[spec.type]);
      case AA.RESTORE:
        return Util.captialize(RES.byVal[spec.resource]);
    }
  }

  static parse(s) {
    let tokens = s.split(' ');
    let [actionStr, magnitude, ...misc] = tokens;
    let spec = null;
    let tags = [];
    let action = AA[actionStr.toUpperCase()];
    if (magnitude) magnitude = parseInt(magnitude, 10);
    if (misc.length > 0) {
      if (misc.some(s => s.startsWith('['))) {
        let i = misc.indexOf(misc.find(s => s.startsWith('[')));
        tags = misc.splice(i, misc.length - i)
          .join(' ')
          .replaceAll(/[\[\]]/g, '')
          .split(/, ?/);
      }
      spec = this.parseActionSpec(action, misc);
    }
    return { action, magnitude, spec, tags };
  }

  static parseActionSpec(action, misc) {
    switch (action) {
      case AA.ATTACK:
      case AA.SPELL:
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