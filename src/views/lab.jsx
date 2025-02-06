import m from 'mithril';

import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

import Card from './card.jsx';

const VIEWS = Constants.gen_enum(['COLLECTION', 'DECKS']);

class LabScreen {
  currentView;

  constructor() {
    this.currentView = VIEWS.COLLECTION;
  }

  view({ attrs }) {
    let player = attrs.player;

    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: '10rem 1fr'
        }}>
          <div class="h-full flex flex-col border-r border-color-1 shadow">
            {
              Object.values(VIEWS).filter(v => typeof v === 'number').map(v => {
                let cur = this.currentView == v;
                return (
                  <div class="p-2 cursor-pointer" onclick={() => this.changeView(v)}>
                    <span>{Util.captialize(VIEWS.byVal[v])}</span>
                  </div>
                );
              })
            }
          </div>
          <div class="flex items-center justify-center p-4">
             {this.renderCurrentView(attrs)}
          </div>
      </div>
    )
  }

  changeView(v) {
    if (VIEWS.byVal[v]) this.currentView = v;
  }

  renderCurrentView(attrs) {
    switch (this.currentView) {
      case VIEWS.COLLECTION:
        return this.renderCollectionView(attrs);
      case VIEWS.DECKS:
        return this.renderDeckView(attrs);
      default:
        return (<div>Unknown view "{this.currentView}"</div>);
    }
  }

  renderCollectionView(attrs) {
    return (<CardCollection cards={attrs.player.collection.cards} />);
  }

  renderDeckView(attrs) {
    return (<DeckEditor player={attrs.player} />);
  }
}

class CardCollection {
  static CARDS_PER_COL = 5;

  view({ attrs }) {
    let cards = attrs.cards;
    return (
      <div class="h-full w-full overflow-auto">
        <div class="grid gap-x-2 gap-y-8"
          style={{
             gridTemplateColumns: `repeat(${attrs.columns || CardCollection.CARDS_PER_COL}, 1fr)`,
             gridAutoFlow: 'row'
          }}>
          {cards.map(c => (<Card card={c} onclick={() => attrs.oncardclick(c)} />))}
        </div>
      </div>
    );
  }
}

class DeckEditor {
  currentDeck = null;

  view({ attrs }) {
    let vw = this.currentDeck ? this.renderEditor(attrs.player) : this.renderDecks(attrs.player);
    return (<div class="h-full w-full">{vw}</div>);
  }

  renderEditor(player) {
    let deck = this.currentDeck;
    return (
      <div class="h-full w-full grid"
        style={{ gridTemplateColumns: '1fr 20% '}}>
          <CardCollection cards={player.collection.cards}
            columns={4}
            oncardclick={(c) => this.addCardToDeck(c)} />
          <div class="border-l border-color-0 grid gap-y-4" style={{ gridTemplateRows: '80% 20%' }}>
            <div class="gap-y-4 overflow-auto">
              {deck.cards.map(c => {
                return (
                  <div class="cursor-pointer p-2" onclick={() => this.removeCardFromDeck(c)}>
                    {c.title}
                  </div>
                );
              })}
            </div>
            <div class="flex flex-col gap-y-8 h-full items-end">
              <div><button onclick={() => this.discardDeck()}>Discard changes</button></div>
              <div><button onclick={() => this.saveDeck(player.collection.decks)}>Save</button></div>
            </div>
          </div>
      </div>
    );
  }

  addCardToDeck(card) {
    this.currentDeck.cards.push(card);
  }
  removeCardFromDeck(card) {
    let i = this.currentDeck.cards.indexOf(card);
    if (i > -1) this.currentDeck.cards.splice(i, 1);
  }

  saveDeck(decks) {
    decks[this.currentDeck.label] = this.currentDeck;
    this.discardDeck();
  }
  discardDeck() {
    this.currentDeck = null;
  }

  renderDecks(player) {
    return (
      <div class="h-full w-full overflow-auto">
        <div class="grid gap-x-2 gap-y-8"
          style={{
             gridTemplateColumns: `repeat(${CardCollection.CARDS_PER_COL}, 1fr)`,
             gridAutoFlow: 'row'
          }}>
          {
            Object.keys(player.collection.decks).sort().map(deckName => {
              return (
                <div class="flex flex-col h-full items-center justify-center cursor-pointer"
                  onclick={() => {
                    this.currentDeck = {
                       label: deckName,
                       cards: [...player.collection.decks[deckName].cards]
                    };
                  }}>
                  <Card facedown={true} />
                  <div class="flex items-center">{deckName}</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default LabScreen;