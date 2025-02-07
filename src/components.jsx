import m from 'mithril';

import Util from './lib/util.js';
import Card from './lib/card.js';
import Encounter from './lib/encounter.js';
import Profile from './lib/profile.js';
import Archetypes from './data/archetypes.js';
import Enemies from './data/enemies.js';

import EncounterScreen from './views/encounter.jsx';
import LabScreen from './views/lab.jsx';

const PLAYER = new Archetypes.TheMeat();
const PROFILE = new Profile(PLAYER);
const ENEMY = Enemies.EnemyArchetype.create(Enemies.ENEMY_KIND.RABBLE, 1);

class App {
  route;
  _encounter;

  constructor() {
  }

  oninit() {
    this.route = m.route.get();
  }

  view() {
    let route = this.route || '';
    try {
      route = m.route.get();
    } catch (ex) { /* we jumped the gun, do nothing lol */ }

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
        player: PROFILE,
        enemy: ENEMY,
        redraw: () => m.redraw()
      });
      return (<EncounterScreen encounter={this._encounter} />);
    } else if (route.startsWith('/lab')) {
      return (<LabScreen player={PROFILE} />);
    } else if (route.startsWith('/dev-tools')) {
      return (<DevToolsScreen player={PROFILE} />);
    }
  }
}

class NavigationBar {
  view({ attrs }) {
    let { route } = attrs;
    return (
      <div class="flex bg-0 border-b border-color-1 shadow items-center justify-center gap-x-4 py-2">
        {this.link(route, '/lab', 'Lab')} |
        {this.link(route, '/encounter', 'Encounter')}
      </div>
    );
  }

  link(route, path, display) {
    return route.startsWith(path)
      ? <strong>{display}</strong>
      : <m.route.Link href={path}>{display}</m.route.Link>
  }
}

class DevToolsScreen {
  view({ attrs }) {
    return (<div>Not implemented</div>);
  }
}

module.exports = {
  App
};