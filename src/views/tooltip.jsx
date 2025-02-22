import m from 'mithril';
import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

const TEXT = {
  'AFFIX_ACTION': {
    [Constants.AFFIX_ACTION.ATTACK]: 'Deal damage of a specified type',
    [Constants.AFFIX_ACTION.AUTOPLAY]: 'Played immediately on draw',
    [Constants.AFFIX_ACTION.RESTORE]: 'Restore a resource',
  }
};

class SideTooltip {
  oncreate(vnode) {
    if (vnode && vnode.dom) this.setPos(vnode);
  }

  onupdate(vnode) {
    this.setPos(vnode);
  }

  view({ attrs, children }) {
    return (
      <div class="group">
        <div class="absolute inset-0 pointer-events-none group-hover:visible">
          <div class="relative w-full h-full pointer-events-none">
            <div class="absolute inline pointer-events-auto side-tooltip-content"
              style={{ top: `${this.top}px`, left: `${this.left}px` }}>
              {attrs.tooltip}
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  setPos({ attrs, dom }) {
    let tt = dom.querySelector('.side-tooltip-content');
    let tipBox = tt.getBoundingClientRect();
    let contentBox = dom.getBoundingClientRect();

    let nextTop = Util.clamp(
      Math.floor(contentBox.top + (contentBox.height / 2) - (tipBox.height / 2)),
      0,
      window.innerHeight - tipBox.height);
    let nextLeft;
    if (attrs.side === 'left') {
      nextLeft = Math.floor(contentBox.left - tipBox.width - attrs.gap);
    } else {
      nextLeft = Math.floor(contentBox.left + contentBox.width + attrs.gap);
    }
    nextLeft = Util.clamp(nextLeft, 0, window.innerHeight - tipBox.width);

    console.log({ contentTop: contentBox.top, contentLeft: contentBox.left, nextTop, nextLeft });
    if (nextLeft != this.left || nextTop != this.top) {
      this.left = nextLeft;
      this.top = nextTop;
      tt.style.left = nextLeft + 'px';
      tt.style.top = nextTop + 'px';
      dom.querySelector('.absolute.inset-0').classList.add('hidden');
    }

    return false;
  }
}

class Tooltip {
  view({ attrs }) {
    let txts = TEXT[attrs.enum];
    let c = Constants[attrs.enum]
    if (txts && txts[attrs.value]) {
      return (
        <abbr title={txts[attrs.value]} class="underline underline-dotted cursor-pointer">
          {Util.captialize(c.byVal[attrs.value])}
        </abbr>
      );
    } else {
      return Util.captialize(c.byVal[attrs.value])
    }
  }

}

export default { Tooltip, SideTooltip };