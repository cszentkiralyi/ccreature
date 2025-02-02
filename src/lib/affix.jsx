import m from 'mithril';

import Constants from './constants.js';
import Util from './util.js';

import { Tooltip } from './tooltip.jsx';

const AA = Constants.AFFIX_ACTION;
const AP = Constants.AFFIX_POSITION;
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

  toTooltipped() {
    return (
      <span>
        <Tooltip enum='AFFIX_ACTION' value={this.action} />
        {' '}
        {[
          this.magnitude,
          Affix.actionDataString(this.action, this.data)
        ].filter(s => s != null).join(' ')
        }
      </span>
    );
  }

  static actionDataString(action, data) {
    switch (action) {
      case AA.ATTACK:
        return Util.captialize(DMG.byVal[data.damage]);
      case AA.RESTORE:
        return Util.captialize(RES.byVal[data.resource]);
    }
  }

  static parseAction(s) {
    let tokens = s.split(' ');
    let [action, magnitude, ...misc] = tokens;
    let data = null;
    if (magnitude) magnitude = parseInt(magnitude, 10);
    if (misc.length > 0) data = parseActionData(action, misc);
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

const AFFIXES = {
  attack: [
    new Affix(AP.PREFIX,
      ['Trainee\'s', 'Blow'],
      { action: AA.ATTACK, magnitude: 5, data: { damage: DMG.PHYSICAL } }),
    new Affix(AP.PREFIX,
      ['Warrior\'s', 'Strike'],
      { action: AA.ATTACK, magnitude: 10, data: { damage: DMG.PHYSICAL } }),
    new Affix(AP.PREFIX,
      ['Mercenary\'s', 'Cut'],
      { action: AA.ATTACK, magnitude: 16, data: { damage: DMG.PHYSICAL } }),
    new Affix(AP.PREFIX,
      ['Soldier\'s', 'Crush'],
      { action: AA.ATTACK, magnitude: 25, data: { damage: DMG.PHYSICAL } }),
  ],
  autoplay: [
    new Affix(AP.PREFIX,
      ['Instant', 'Imperative'],
      { action: AA.AUTOPLAY }
    )
  ],
  restore: [
    new Affix(AP.PREFIX,
      ['Healer\'s', 'Heal'],
      { action: AA.RESTORE, magnitude: 10, data: { resource: RES.LIFE }}),
  ]
};

export { Affix, AFFIXES }