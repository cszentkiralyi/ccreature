import m from 'mithril';

import Constants from '../lib/constants.js';

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
      <div class="grid rounded bg-white border border-color-card shadow cursor-default noselect"
        style={{
          gridTemplateRows: '15% 1fr 1rem',
          borderWidth: '2px',
          height: attrs.height || Card.HEIGHT,
          width: attrs.width || Card.WIDTH
        }}
        onclick={attrs.onclick}
        onmouseenter={onmenter}
        onmouseleave={onmleave} >
        <div class={`flex px-4 border-b border-color-${rarityStr} bg-${rarityStr} bg-opacity-40
         items-center text-left nowrap overflow-hidden overflow-ellipsis`}
          style={{ borderWidth: "4px" }}>
          {attrs.card.title}
        </div>
        <div class="flex flex-col m-2 items-center justify-center text-center">
          {attrs.card.affixes.map(a => (<div>{a.toTooltipped()}</div>))}
        </div>
        <div class="text-center opacity-60 text-sm">
          {rarityStr}
        </div>
      </div>
    )
  }

  view_facedown({ attrs }) {
    return (
      <div class="rounded bg-card-back border border-color-card shadow cursor-default noselect"
        style={{
          height: attrs.height || Card.HEIGHT,
          width: attrs.width || Card.WIDTH
        }} />
    );
  }
}

export default Card;