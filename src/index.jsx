import m from 'mithril';

import { App } from './components.jsx';

let root = document.body.querySelector('#app');
m.route(root, '/lab', {
  '/lab': App,
  '/encounter': App,
  '/dev-tools': App
});
//m.mount(root, App);