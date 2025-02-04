import m from 'mithril'

import BaseAnimations from './base.jsx';

class PlayCard extends BaseAnimations.TranslateAnimation {
  verticalRange = { start: '60%', end: '25%' }
  length = 1200;

  view({ attrs }) {
    this.start();
    return (
      <div class="absolute inset-0" style={{ zIndex: 1000 }}>
        <div class="relative w-full h-full">
          <div class="absolute transition:top transition-slow"
           style={{ left: '45%', top: this.vertical, transitionTimingFunction: 'ease-out' }}>
            {attrs.card}
          </div>
        </div>
      </div>
    );
  }
}

class DrawCard extends BaseAnimations.TranslateAnimation {
  verticalRange = { start: '25%', end: '60%' }
  horizontalRange = { start: '80%', end: '70%' }
  length = 400;

  view({ attrs }) {
    this.start();
    return (
      <div class="absolute inset-0" style={{ zIndex: 1 }}>
        <div class="relative w-full h-full">
          <div class="absolute transition transition-fast"
            style={{
              left: this.horizontal,
              top: this.vertical,
              transitionProperty: 'top, left',
              transitionTimingFunction: 'linear'
            }}>
            {attrs.card}
          </div>
        </div>
      </div>
    );
  }
}

export default {
  PlayCard,
  DrawCard
}