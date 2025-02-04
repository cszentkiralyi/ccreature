import m from 'mithril'

class BaseAnimation {
  started = false;
  length;
  _remove;
  _start;
  decorators = { remove: [], start: [] };

  decorateRemove(f) {
    if (this.decorators.remove.indexOf(f) == -1) {
      this.decorators.remove.push(f);
    }
  }

  decorateStart(f) {
    if (this.decorators.start.indexOf(f) == -1) {
      this.decorators.start.push(f);
    }
  }

  get remove() { return this._remove; }
  set remove(v) { this._remove = v; }

  start() {
    if (this.started) return;
    this.started = true;
    let len = this.length * ((this.length < 50) ? 1000 : 1);
    this.decorators.start.forEach(f => f());
    window.setTimeout(() => this.remove(), len);
  }
}

class TranslateAnimation extends BaseAnimation {
  card;
  verticalRange = {};
  horizontalRange = {};
  vertical = '50%';
  horizontal = '50%';

  oninit({ attrs }) {
    this.remove = attrs.remove;
    this.vertical = this.verticalRange.start;
    this.horizontal = this.horizontalRange.start;
    this.decorateStart(() => {
      window.setTimeout(() => {
        this.vertical = this.verticalRange.end || this.vertical;
        this.horizontal = this.horizontalRange.end || this.horizontal;
        m.redraw();
      }, 1);
    });
  }

}

export default {
  BaseAnimation,
  TranslateAnimation
}
