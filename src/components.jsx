import m from 'mithril';

import Util from './lib/util.js';
import Card from './lib/card.js';
import Encounter from './lib/encounter.js';
import Archetypes from './data/archetypes.js';
import Enemies from './data/enemies.js';

import EncounterScreen from './views/encounter.jsx';

const PLAYER = new Archetypes.TheMeat();
const ENEMY = Enemies.EnemyArchetype.create(Enemies.ENEMY_KIND.RABBLE, 1);
const TEST_ENCOUNTER = new Encounter({
  player: PLAYER,
  enemy: ENEMY,
  redraw: () => m.redraw()
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
    if (this._obs) {
      this._obs.disconnect();
    }
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

module.exports = {
  App
};