const DOMUtil = {
    poscorrect: (el, pos) => {
        let box = { top: 0, left: 0, bottom: 0, right: 0 };
        let parent = el;
        let pbox;
        while (parent = parent.closest('.relative')) {
            pbox = parent.getBoundingClientRect();
            for (k in box) box[k] += pbox[k];
        }
        if (!parent) return pos;
        let ret = {};
        if (pos.left) ret.left = pos.left - box.left;
        if (pos.right) ret.right = pos.right - box.right;
        if (pos.top) ret.top = pos.top - box.top;
        if (pos.bottom) ret.bottom = pos.bottom - box.bottom;
        return ret;
    }
};

export default DOMUtil;