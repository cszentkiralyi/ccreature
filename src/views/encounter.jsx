import m from 'mithril';

import Util from '../lib/util.js';
import Constants from '../lib/constants.js';

import Card from './card.jsx';

class EncounterScreen {
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

        <div class="cursor-pointer">
          <EncounterCardPile count={encounter.entities['player'].deck.count('discard')} />
        </div>
        <div class="">
          <div>Play area</div>
          <div><code>{Constants.ENCOUNTER_STATE.byVal[encounter.state]}</code></div>
          </div>
        <div class="cursor-pointer">
          <EncounterCardPile count={encounter.entities['player'].deck.count('draw')}
            onclick={() => encounter.gameEvent('player-deck-click')}
          />
        </div>

        <div class="">Life pool</div>
        <div class="">
          <EncounterHand
            hand={encounter.entities['player'].hand}
            onselect={(card) => encounter.gameEvent('player-play-card', { card })}
             />
            </div>
        <div class="">Mana pool</div>
      </div>
    );
  }
}

class EncounterHand {
  static ROTATION = { MIN: -8, MAX: 8, CARDS: 12 };
  static CARD_RAISE_REM = 1;
  hovering = null;
  selected = null;

  view({ attrs }) {
    // Horizontal layout
    let horizontal;
    {
      let interp = 0;
      let d = 1;
      let b = 0.1;
      let c = attrs.hand.length;
      if (c > 1) {
        interp = (d - 2 * b) / (c - 1);
      }
      horizontal = (i) => Math.floor((interp * i * (1 - b) + b) * 100);
    }

    // Rotation/fanning
    let rotation;
    {
      let factor = Util.clamp(attrs.hand.length / EncounterHand.ROTATION.CARDS, 0, 1);
      let min = EncounterHand.ROTATION.MIN * factor;
      let max = EncounterHand.ROTATION.MAX * factor;
      rotation = (i) => Util.interp(min, max, i / attrs.hand.length);
    }

    let cardTop;
    {
      let factor = attrs.hand.length / EncounterHand.ROTATION.CARDS;
      let radius = 5;
      let alpha = factor * 2 * Math.PI * (EncounterHand.ROTATION.MAX - EncounterHand.ROTATION.MIN) / 360;
      let half = attrs.hand.length / 2;
      cardTop = (i) => (1 - (i > half ? i - half : half - i) / half) * alpha * radius;
    }

    return (
      <div class="relative"
        style={{ height: `calc(${Card.HEIGHT} + 0.5rem)` }}>
        {attrs.hand.map((card, i) => {
          let sel = this.selected == i;
          let hov = sel || (this.hovered == i && this.selected == null);
          let onclick;
          if (sel) {
            onclick = () => { this.selected = null; attrs.onselect(card) };
          } else if (this.selected != null) {
            onclick = () => this.selected = null;
          } else {
            onclick = () => this.selected = i;
          }

          return (<div class="absolute"
            style={{
              height: Card.HEIGHT,
              width: Card.WIDTH,
              fontSize: '85%',
              zIndex: hov ? 999 : i,
              top: `-${(cardTop(i) + (hov ? EncounterHand.CARD_RAISE_REM : 0)).toFixed(2)}rem`,
              bottom: 0,
              left: `calc(${horizontal(i)}% - (${Card.WIDTH} / 2))`,
              transition: 'top 0.15s ease-out, z-index 0.15 linear',
              transform: `rotate(${rotation(i)}deg)`
            }}>
            <Card card={card}
             onclick={onclick}
             onhoverstart={() => this.hovered = i}
             onhoverend={() => this.hovered = null} />
          </div>)
        })}
      </div>
    );
  }
}

class EncounterCardPile {
  static ROTATION = { MIN: -7, MAX: 7 };

  hover;

  generateRotations(n) {
    this.rotations = (this.rotations || []).concat(
      (new Array(n))
        .fill(null)
        .map(_ => Util.interp(EncounterCardPile.ROTATION.MIN,
          EncounterCardPile.ROTATION.MAX, Math.random())));
  }

  oninit(vnode) {
    this.generateRotations(vnode.attrs.count);
  }

  onupdate(vnode) {
    if (this.rotations.length < this.count) {
      this.generateRotations(this.count - this.rotations.length);
    }
  }

  view({ attrs }) {
    let onclick = attrs.onclick || ((e) => null);
    this.count = attrs.count;
    return (
      <div class="flex items-center justify-center">
        <div class="relative"
         style={{ height: Card.HEIGHT, width: Card.WIDTH }}
         onclick={onclick}>
          <div class="absolute flex inset-0 items-center justify-center noselect
            hover:opacity-100 opacity-0 transition:opacity text-xl text-white"
            style={{ zIndex: 1000 }}>
            {attrs.count > 0 ? attrs.count : ''}
          </div>
          {
            (new Array(attrs.count)).fill(null).map((_, i) => {
              let rot = (this.rotations && this.rotations.length) > i
                ? this.rotations[i]
                : 0;
              return (
                <div class="absolute inset-0"
                 style={{ transform: `rotate(${rot.toFixed(2)}deg)` }}>
                  <Card facedown={true} />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default EncounterScreen;