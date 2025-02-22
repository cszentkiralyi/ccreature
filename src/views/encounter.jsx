import m from 'mithril';

import Util from '../lib/util.js';
import Constants from '../lib/constants.js';
import Queue from '../lib/queue.js';

import Card from './card.jsx';
import Animation from './animation.jsx';

class EncounterScreen {
  animations = {};
  overlays = new Queue();

  oninit({ attrs }) {
    attrs.encounter.animate = (...args) => this.animate(...args);
  }

  view({ attrs }) {
    let encounter = this.encounter = attrs.encounter;
    let handGlow = null;
    if (encounter.canPlay) {
      handGlow = 'glow-blue';
    } else if (encounter.canDiscard) {
      handGlow = 'glow-red';
    }
    let onHandSelect = null;
    if (encounter.canPlay) {
      onHandSelect = (card) => {
        encounter.gameEvent('player-play-card', { card });
      }
    } else if (encounter.canDiscard) {
      onHandSelect = (card) => encounter.gameEvent('player-discard-card', { card });
    }

    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: "20% 1fr 20%",
          gridTemplateRows: "20% 1.25fr 1fr"
        }}>
        <div>
          { this.renderAnimations() }
          { this.renderOverlay() }
        </div>
        <div class="">
          <EncounterHealthbar entity={encounter.entities.enemy} />
        </div>
        <div />

        <div class="">
          <EncounterCardPile count={encounter.entities.player.deck.count('discard')} />
        </div>
        <div class="">
          <div>Play area</div>
          <div><code>{Constants.ENCOUNTER_STATE.byVal[encounter.gameState]}</code></div>
        </div>
        <div class="">
          <EncounterCardPile count={encounter.entities.player.deck.count('draw')}
            onclick={() => encounter.gameEvent('player-draw-card')}
          />
          <div class="my-4 text-center">
            <button onclick={() => encounter.gameEvent('player-pass')}>Pass</button>
          </div>
        </div>

        <div class="">
          <EncounterResourceGlobe position="left" color="#f00"
            current={encounter.entities.player.life}
            max={encounter.entities.player.maxLife} />
        </div>
        <div class="">
          <EncounterHand
            hand={encounter.entities.player.hand}
            onselect={onHandSelect}
            doubleclick={false}
            glow={handGlow}
          />
        </div>
        <div class="">
          <EncounterResourceGlobe position="right" color="#00f"
            current={encounter.entities.player.mana}
            max={encounter.entities.player.maxMana} />
        </div>
      </div>
    );
  }

  renderAnimations() {
    let a = this.animations;
    return (
      <div>
          {
            a['play-card'] && a['play-card'].current
            ? (<Animation animation={
                  a['play-card'].current.source == 'player'
                  ? 'play-card-north' : 'play-card-south'
                }
                duration="1.2s"
                style={{ left: '45%', zIndex: 999 }}
                onend={() => this.endAnimation('play-card')}>
                <Card card={a['play-card'].current.card} />
              </Animation>)
            : null
          }
          {
            a['draw-card'] && a['draw-card'].current
            ? (<Animation animation='player-draw-card'
                duration="0.25s" style={{ zIndex: 999 }}
                onend={() => this.endAnimation('draw-card')}>
                <Card facedown={true} />
              </Animation>)
            : null
          }
      </div>
    )
  }

  renderOverlay() {
    let overlayWidth = 40; // rem
    let overlayHeight = 20
    if (!this.overlays.current) return;
    let o = this.overlays.current;
    return (
      <div class="absolute inset-0">
        <div class="relative h-full w-full">
          <div class="absolute inset-0 bg-black opacity-20" style={{ zIndex: 998 }}></div>
          <div class="absolute bg-white shadow border border-color-1 flex flex-col items-center justify-center"
           style={{
             width: `${overlayWidth}rem`,
             height: `${overlayHeight}rem`,
             top: `calc(50% - ${(overlayHeight / 2).toFixed(2)}rem)`,
             left: `calc(50% - ${(overlayWidth / 2).toFixed(2)}rem)`,
             zIndex: 999
           }}>
            <div style={{ paddingBottom: '4rem' }}>{o.message}</div>
            <div class="flex items-center">
              <button onclick={o.action}>
                {o.button}
              </button>
            </div>
           </div>
        </div>
      </div>
    );
  }

  animate(event, args) {
    switch (event) {
      case 'enemy-play-card':
        this.queueAnimation('play-card', { card: args.card, source: 'enemy' });
        break;
      case 'player-play-card':
        this.queueAnimation('play-card', { card: args.card, source: 'player' });
        break;
      case 'player-draw-card':
        this.queueAnimation('draw-card', true);
        break;
      case 'player-win':
      case 'player-lose':
        let screens = [];
        let win = event === 'player-win';
        let loot = win
          ? this.encounter.trueEnemy.getLoot(this.encounter.entities.player.level)
          : null;
        if (win && loot && loot.length > 0) {
          screens.push({
            message: `Received ${loot.length} cards.`,
            button: 'neat',
            action: () => null
          });
        }
        screens.push({
          message: win ? 'Win.' : 'Lose.',
          button: 'to the lab',
          action: () => null
        });
        let a = screens[0].action;
        screens[0].action = () => { a(); m.route.set('/lab'); }
        screens.reverse().forEach(screen => this.queueOverlay(screen));
        break;
    }
  }

  queueAnimation(anim, data) {
    if (!this.animations[anim]) {
      this.animations[anim] = new Queue(data);
      m.redraw();
    } else {
      this.animations[anim].push(data);
    }
  }
  endAnimation(anim) {
    if (!this.animations[anim]) throw `Can't stop non-running animation '${anim}'`;
    setTimeout(() => { this.animations[anim].next(); m.redraw(); } );
  }

  queueOverlay(data) {
    let action = data.action;
    data.action = () => {
      action();
      this.overlays.next();
    };
    this.overlays.push(data);
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
          if (sel || !attrs.doubleclick) {
            onclick = () => { this.selected = null; attrs.onselect(card) };
          } else if (this.selected != null) {
            onclick = () => this.selected = null;
          } else if (attrs.onselect) {
            onclick = () => this.selected = i;
          }

          return (<div class="absolute cursor-pointer"
            style={{
              height: Card.HEIGHT,
              width: Card.WIDTH,
              zIndex: hov ? 999 : i,
              top: `-${(cardTop(i) + (hov ? EncounterHand.CARD_RAISE_REM : 0)).toFixed(2)}rem`,
              bottom: 0,
              left: `calc(${horizontal(i)}% - (${Card.WIDTH} / 2))`,
              transition: 'top 0.15s ease-out, z-index 0.15 linear',
              transform: `rotate(${rotation(i)}deg)`
            }}>
            <Card card={card}
             onclick={onclick}
             shadow={attrs.glow}
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
      Util.genArray(n, _ => Util.interp(EncounterCardPile.ROTATION.MIN, EncounterCardPile.ROTATION.MAX, Math.random())));
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
          <div class="absolute flex inset-0 items-center justify-center pointer-events-none
            hover:opacity-100 opacity-0 transition:opacity transition-fast text-xl text-white"
            style={{ zIndex: 1000 }}>
            {attrs.count > 0 ? attrs.count : ''}
          </div>
          {
            Util.genArray(attrs.count, i => {
              let rot = (this.rotations && this.rotations.length) > i
                ? this.rotations[i]
                : 0;
              return (
                <div class="absolute inset-0 cursor-pointer"
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

class EncounterHealthbar {
  view({ attrs }) {
    let pct = attrs.entity.life / attrs.entity.maxLife;
    return (
      <div class="flex w-full h-full items-center justify-center">
        <div class="mx-4 my-2 border border-color-0 p-2" style={{ width: '80%' }}>
          <div class="bg-black" style={{ width: `${(pct * 100).toFixed(1)}%` }}>&nbsp;</div>
        </div>
      </div>
    )
  }
}

class EncounterResourceGlobe {
  static DIAMETER = 16; // rem
  static OFFSET_PCT = 0.33;

  view({ attrs }) {
    let { position, color, current, max } = attrs;
    let pct = current / max;
    let offset = EncounterResourceGlobe.DIAMETER * EncounterResourceGlobe.OFFSET_PCT;
    let offsetPctComp = 1 - EncounterResourceGlobe.OFFSET_PCT;

    let globeHeight = `calc(${(EncounterResourceGlobe.OFFSET_PCT * 100).toFixed(0)}% + ${offsetPctComp.toFixed(2)} * ${(pct * 100).toFixed(1)}%)`;

    return (
      <div class="relative w-full h-full overflow-hidden">
        <div class="absolute w-full flex justify-center pointer-events-none text-white"
          style={{
            zIndex: 1,
            top: `${(offsetPctComp * EncounterResourceGlobe.DIAMETER).toFixed(0)}rem`,
            insetX: 0,
            [position]: `-${offset}rem`
          }}>
          {current} / {max}
        </div>
        <div class="absolute flex overflow-hidden border border-color-0 items-end"
          style={{
            height: `${EncounterResourceGlobe.DIAMETER}rem`,
            width: `${EncounterResourceGlobe.DIAMETER}rem`,
            top: `${offset}rem`,
            [position]: `-${offset}rem`,
            borderRadius: `${EncounterResourceGlobe.DIAMETER * 2}rem`
          }}>
          <div class="w-full transition:height transition-fast"
           style={{ height: globeHeight, backgroundColor: color }} />
        </div>
      </div>
    );
  }
}

export default EncounterScreen;