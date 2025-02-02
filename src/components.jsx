import m from 'mithril';

import { Card, AFFIXES } from './lib/card.js';

class App {
  _h;
  _w;

  constructor() {
    let winW = this._w = window.innerWidth,
      winH = this._h = window.innerHeight;
    let minRatio = 16 / 9;
    if (winW / winH < minRatio) {
      this._h = (9 * winW) / 16;
    }

    console.log(new Card(
      { affixes: [ AFFIXES['attack'][0], AFFIXES['attack'][0] ]}
    ).title);
  }
  view() {
    let h = this._h, w = this._w;
    return (
      <div style={{ height: h + 'px', width: w + 'px', marginTop: 'auto' }}
        class="border border-color-50">
        <EncounterScreen />
      </div>
    );
  }
}

class EncounterScreen {
  _encounter;

  constructor({ encounter }) {
    this._encounter = encounter;
  }

  view() {
    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: "20% 1fr 20%",
          gridTemplateRows: "20% 1.25fr 1fr"
        }}>
        <div class="border border-color-50">Blank</div>
        <div class="border border-color-50">Enemy health</div>
        <div class="border border-color-50">Blank</div>

        <div class="border border-color-50">Discard</div>
        <div class="border border-color-50">Play area</div>
        <div class="border border-color-50">Draw pile</div>

        <div class="border border-color-50">Life pool</div>
        <div class="border border-color-50">Hand</div>
        <div class="border border-color-50">Mana pool</div>
      </div>
    );
  }

}

module.exports = {
  App
};