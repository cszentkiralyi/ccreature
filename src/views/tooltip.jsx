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

export default Tooltip;