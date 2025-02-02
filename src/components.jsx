import m from 'mithril';

class App {
    _h;
    _w;

    constructor() {
        let winW = this._w = window.innerWidth,
            winH = this._h = window.innerHeight;
        let minRatio = 16 / 9;
        if (winW / winH < minRatio) {
            this._h = (9 * winW) / 16;
        }

        console.log({ w: this._w, h: this._h });
    }
    view() {
        let h = this._h, w = this._w;
        return (
            <div style={{ height: h + 'px', width: w + 'px', marginTop: 'auto' }}
                 class="border border-color-50">
                <div class="w-full h-full flex items-center justify-center">
                    Hello world!
                </div>
            </div>
        );
    }
}

module.exports = {
  App
};