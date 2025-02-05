import m from 'mithril';

class Animation {
  view({ attrs, children }) {
    return (
      <div class="absolute inset-0">
        <div class="relative">
          <div class="absolute"
            style={{ animation: `${attrs.duration} linear 1 ${attrs.animation}`, ...attrs.style }}
            onanimationend={() => attrs.onend() }>
              {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Animation;