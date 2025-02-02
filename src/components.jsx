import m from 'mithril';

import Constants from './lib/constants.js';
import { Card } from './lib/card.js';
import { Encounter } from './lib/encounter.js';

const TEST_ENCOUNTER = new Encounter({
  /*playerCards: [
    new Card({ affixes: [AFFIXES['attack'][1], AFFIXES['attack'][2]] }),
    new Card({ affixes: [AFFIXES['autoplay'][0], AFFIXES['restore'][0]] }),
    new Card({ affixes: [AFFIXES['restore'][0], AFFIXES['autoplay'][0]] }),
  ]
    */
  playerCards: (new Array(5)).fill(null).map(_ => Card.generate())

});

class App {
  _h;
  _w;

  _obs;

  constructor() {
    this.updateDims(true);
    this._obs = new ResizeObserver((entries) => this.updateDims());
    this._obs.observe(window.document.body);
  }

  updateDims(preventRedraw) {
    let winW = this._w = window.innerWidth,
      winH = this._h = window.innerHeight;
    let minRatio = 16 / 9;
    if (winW / winH < minRatio) {
      this._h = (9 * winW) / 16;
    }

    if (!preventRedraw) m.redraw();
  }

  onbeforeremove() {
    this._obs.disconnect();
  }

  view() {
    let h = this._h, w = this._w;
    return (
      <div class="grid overflow-hidden"
        style={{ height: h + 'px', width: w + 'px', marginTop: 'auto',
          gridTemplateRows: '3rem 1fr' }}>
        <div class="bg-0 text-center py-2">Navbar</div>
        <EncounterScreen encounter={TEST_ENCOUNTER} />
      </div>
    );
  }
}

class EncounterScreen {
  _encounter;

  constructor() {
  }

  view({ attrs }) {
    let encounter = attrs.encounter;
    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: "20% 1fr 20%",
          gridTemplateRows: "20% 1.25fr 1fr"
        }}>
        <div class="">Blank</div>
        <div class="">Enemy health</div>
        <div class="">Blank</div>

        <div class="">
          Discard pile ({encounter.entities['player'].deck.count('discard')})
        </div>
        <div class="">Play area</div>
        <div class="cursor-pointer"
          onclick={() => encounter.entities['player'].drawCard()}>
          Draw pile ({encounter.entities['player'].deck.count('draw')})
        </div>

        <div class="">Life pool</div>
        <div>
          <EncounterHand
            hand={encounter.entities['player'].hand}
            ondiscard={(card) => encounter.entities['player'].discardCard(card)}
             />
            </div>
        <div class="">Mana pool</div>
      </div>
    );
  }
}

class ECard {
  view({ attrs }) {
    return (
      <div class="w-full h-full border border-color-50 grid"
        style={{ gridTemplateRows: '15% 1fr 1rem' }}
         onclick={attrs.onclick}>
        <div class="flex px-4 border-b border-color-50 items-center text-left nowrap overflow-hidden overflow-ellipsis">
          {attrs.card.title}
        </div>
        <div class="flex flex-col m-2 items-center justify-center text-center">
          {attrs.card.affixes.map(a => (<div>{a.toTooltipped()}</div>))}
        </div>
        <div class="text-center opacity-60 text-sm">
         {Constants.RARITY.byVal[attrs.card.rarity].toLowerCase()}
        </div>
      </div>
    )
  }
}

class EncounterHand {
  _hand;
  constructor({ attrs }) {
    this._hand = attrs.hand;
  }
  view({ attrs }) {
    return (
      <div class="flex gap-x-4 w-full overflow-auto nowrap py-2">
        {this._hand.map(card => (
          <div style={{ height: '13rem', width: '10rem', fontSize: '85%' }}>
            <ECard card={card} onclick={() => attrs.ondiscard(card)} />
          </div>
          ))}
      </div>
    );
  }
}

module.exports = {
  App
};