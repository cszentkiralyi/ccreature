import m from 'mithril';

import Util from './lib/util.js';
import Card from './lib/card.js';
import Encounter from './lib/encounter.js';
import Archetypes from './data/archetypes.js';
import Enemies from './data/enemies.js';
import Profile from './data/profile.js';

import EncounterScreen from './views/encounter.jsx';
import LabScreen from './views/lab.jsx';

const PLAYER = new Archetypes.TheMeat();
const ENEMY = Enemies.EnemyArchetype.create(Enemies.ENEMY_KIND.RABBLE, 1);

class App {
  _encounter;
  _profile;

  constructor() {
    this._profile = new Profile(new Archetypes.TheMeat());
  }

  view() {
    let route = m.route.get();
    return (
      <div class="grid w-full h-full overflow-hidden"
        style={{ gridTemplateRows: '3rem 1fr' }}>
        <NavigationBar route={route} />
        {this.renderRoute(route)}
      </div>
    );
  }

  renderRoute(route) {
    if (route.startsWith('/encounter')) {
      this._encounter = this._encounter || new Encounter({
        player: this._profile,
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