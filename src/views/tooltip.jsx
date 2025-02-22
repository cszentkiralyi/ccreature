import m from 'mithril';
import Constants from '../lib/constants.js';
import Util from '../lib/util.js';
import DOMUtil from './dom.js';

const TEXT = {
  'AFFIX_ACTION': {
    [Constants.AFFIX_ACTION.ATTACK]: 'Deal damage of a specified type',
    [Constants.AFFIX_ACTION.AUTOPLAY]: 'Played immediately on draw',
    [Constants.AFFIX_ACTION.RESTORE]: 'Restore a resource',
  }
};

class SideTooltip {
  oncreate(vnode) {
    if (vnode && vnode.dom) {
      if (!vnode.attrs.fixed) this.setPos(vnode);
      vnode.dom.querySelector('.absolute.inset-0').classList.add('hidden');
    }
  }

  onupdate(vnode) {
    if (!vnode.attrs.fixed) this.setPos(vnode);
  }

  view({ attrs, children }) {
    let top = attrs.fixed ? attrs.top : this.top + 'px';
    let left = attrs.fixed ? attrs.left : this.left + 'px';
    return (
      <div class="group">
        <div class="absolute inset-0 pointer-events-none group-hover:visible">
          <div class="relative w-full h-full pointer-events-none">
            <div class="absolute inline pointer-events-auto side-tooltip-content"
              style={{ top, left }}>
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
    nextLeft = Util.clamp(nextLeft, 0, window.innerWidth - tipBox.width);

    if (nextLeft != this.left || nextTop != this.top) {
      let correct = DOMUtil.poscorrect(dom, { left: nextLeft, top: nextTop });
      this.left = correct.left;
      this.top = correct.top;
      tt.style.left = this.left + 'px';
      tt.style.top = this.top + 'px';
      dom.querySelector('.absolute.inset-0');
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