import m from 'mithril';

import Constants from './lib/constants.js';
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
      return (<EncounterScreen encounter={this._encounter} />);
    } else if (route.startsWith('/lab')) {
      if (this._encounter
          && [Constants.ENCOUNTER_STATE.PLAYER_WIN,
              Constants.ENCOUNTER_STATE.PLAYER_LOSE].includes(this._encounter.gameState))
        this._encounter = null;
      return (<LabScreen player={PROFILE}
                startEncounter={() => this.startEncounter()}
                continueEncounter={() => m.route.set('/encounter')} />);
    } else if (route.startsWith('/dev-tools')) {
      return (<DevToolsScreen player={PROFILE} />);
    }
  }

  startEncounter() {
    this._encounter = new Encounter({
      player: PROFILE,
      enemy: ENEMY,
      end: {
        win: () => {
          let loot = ENEMY.getLoot(1, true);
          PROFILE.collection.addCards(loot.map(c => ({ card: c, count: 1 })))
        },
        lose: () => {
        }
      },
      redraw: () => m.redraw()
    });

    m.route.set('/encounter');
  };
}


class NavigationBar {
  view({ attrs }) {
    let { route } = attrs;
    return (
      <div class="flex relative bg-0 border-b border-color-1 items-center shadow px-8 gap-x-8">
        <div class="flex-grow" />
        {this.link(route, '/lab', 'Lab')} |
        {this.link(route, '/Encounter', 'Encounter')}
        <div class="flex-grow" />
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