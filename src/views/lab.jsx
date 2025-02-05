import m from 'mithril';

class LabScreen {
  view({ attrs }) {
    let player = attrs.player;

    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: '10rem 1fr'
        }}>
          <div class="border-r border-color-1 flex flex-col items-center justify-center shadow">
            Sidebar
          </div>
          <div class="flex items-center justify-center">
            Content
          </div>
      </div>
    )
  }

}

export default LabScreen;