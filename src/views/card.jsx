import m from 'mithril';

import Constants from '../lib/constants.js';
import Affix from '../lib/affix.js';
import Tooltip from './tooltip.jsx';

class Card {
  static HEIGHT = '13rem';
  static WIDTH = '10rem';

  hovered = false;

  view({ attrs, ...props }) {
    if (attrs.facedown) {
      return this.view_facedown({ attrs, ...props });
    }

    let rarityStr = Constants.RARITY.byVal[attrs.card.rarity].toLowerCase();
    let onmenter = attrs.onhoverstart || ((e) => null);
    let onmleave = attrs.onhoverend || ((e) => null);
    return (
      <div class={`grid rounded bg-white border border-color-card ${(attrs.shadow) || 'shadow'} noselect`}
        style={{
          fontSize: '65%',
          gridTemplateRows: '15% 1fr 1rem',
          borderWidth: '2px',
          height: attrs.height || Card.HEIGHT,
          width: attrs.width || Card.WIDTH,
        }}
        onclick={attrs.onclick}
        onmouseenter={onmenter}
        onmouseleave={onmleave} >
        <div class={`flex px-4 border-b border-color-${rarityStr} bg-${rarityStr} bg-opacity-40
         items-center text-left`}
          style={{ borderWidth: "4px" }}>
          {attrs.card.title}
        </div>
        <div class="flex flex-col m-2 items-center justify-center text-center">
          {attrs.card.affixes.map(a => (<div>{this.tooltipAffix(a)}</div>))}
        </div>
        <div class="text-center opacity-60 text-sm">
          {rarityStr}
        </div>
      </div>
    )
  }

  view_facedown({ attrs }) {
    return (
      <div class={`rounded bg-card-back border border-color-card ${attrs.shadow || 'shadow'} noselect`}
        style={{
          height: attrs.height || Card.HEIGHT,
          width: attrs.width || Card.WIDTH
        }} />
    );
  }

  tooltipAffix(affix) {
    return (
      <span>
        <Tooltip enum='AFFIX_ACTION' value={affix.action} />
        {' '}
        {[
          affix.magnitude,
          Affix.actionString(affix.action, affix.spec)
        ].filter(s => s != null).join(' ')
        }
      </span>
    );
  }
}

export default Card;