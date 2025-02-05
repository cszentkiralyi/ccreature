import m from 'mithril';

import Util from './lib/util.js';
import Card from './lib/card.js';
import Encounter from './lib/encounter.js';
import Archetypes from './data/archetypes.js';
import Enemies from './data/enemies.js';

import EncounterScreen from './views/encounter.jsx';
import LabScreen from './views/lab.jsx';

const PLAYER = new Archetypes.TheMeat();
const ENEMY = Enemies.EnemyArchetype.create(Enemies.ENEMY_KIND.RABBLE, 1);

class App {
  _h;
  _w;

  _obs;

  _encounter;

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
    let route = m.route.get();
    return (
      <div class="grid overflow-hidden"
        style={{ height: h + 'px', width: w + 'px', marginTop: 'auto',
          gridTemplateRows: '3rem 1fr' }}>
        <NavigationBar route={route} />
        {this.renderRoute(route)}
      </div>
    );
  }

  renderRoute(route) {
    if (route.startsWith('/encounter')) {
      this._encounter = this._encounter || new Encounter({
        player: PLAYER,
        enemy: ENEMY,
        redraw: () => m.redraw()
      });
      return (<EncounterScreen encounter={this._encounter} />);
    } else if (route.startsWith('/lab')) {
      return (<LabScreen player={PLAYER} />);
    }
  }
}

class NavigationBar {
  view({ attrs }) {
    let { route } = attrs;
    return (
      <div class="flex bg-0 items-center justify-center gap-x-4 py-2">
        <m.route.Link href="/lab">Lab</m.route.Link>
        |
        <m.route.Link href="/encounter">Encounter</m.route.Link>
      </div>
    );
  }
}

module.exports = {
  App
};