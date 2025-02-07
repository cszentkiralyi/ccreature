import m from 'mithril';

import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

import Card from './card.jsx';
import Profile from '../lib/profile.js';

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
        return (<CardCollectionView cards={attrs.player.collection.cards} />);
      case VIEWS.DECKS:
        return (<DeckEditorView player={attrs.player} />);
      default:
        return (<div>Unknown view "{this.currentView}"</div>);
    }
  }
}

class CardCollectionView {
  static CARDS_PER_COL = 5;

  view({ attrs }) {
    let cards = attrs.cards;
    return (
      <div class="h-full w-full overflow-auto">
        <div class="grid gap-x-2 gap-y-8"
          style={{
             gridTemplateColumns: `repeat(${attrs.columns || CardCollectionView.CARDS_PER_COL}, 1fr)`,
             gridAutoFlow: 'row'
          }}>
          {cards.map(({ card, count }) => (
            <div class="w-full h-full flex flex-col gap-y-2 items-center justify-center">
              <Card card={card} onclick={() => attrs.oncardclick(card)} />
              <div class="text-sm">x{count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class DeckEditorView {
  current = null;

  view({ attrs }) {
    let vw = this.current ? this.renderEditor(attrs.player) : this.renderDecks(attrs.player);
    return (<div class="h-full w-full">{vw}</div>);
  }

  renderEditor(player) {
    let deck = this.current;
    return (
      <div class="h-full w-full grid"
        style={{ gridTemplateColumns: '1fr 20% '}}>
          <CardCollectionView cards={player.collection.cards}
            columns={4}
            oncardclick={(c) => this.current.cards.addCard(c)} />
          <div class="border-l border-color-0 grid gap-y-4" style={{ gridTemplateRows: '80% 20%' }}>
            <div class="gap-y-4 overflow-auto">
              {deck.cards.cards.map(({ card, count }) => {
                return (
                  <div class="cursor-pointer p-2" onclick={() => this.current.cards.removeCard(card)}>
                    {count}x {card.title}
                  </div>
                );
              })}
            </div>
            <div class="flex flex-col py-8 gap-y-8 h-full">
              <div><button onclick={() => this.discardDeck()}>Discard changes</button></div>
              <div><button onclick={() => this.saveDeck(player.collection)}>Save</button></div>
            </div>
          </div>
      </div>
    );
  }

  addCardToDeck(card) {
    this.current.cards.addCard(card);
  }

  saveDeck(collection) {
    collection.setDeck(this.current.label, this.current.cards.cards);
    this.discardDeck();
  }
  discardDeck() {
    this.current = null;
  }

  renderDecks(player) {
    return (
      <div class="h-full w-full overflow-auto">
        <div class="grid gap-x-2 gap-y-8"
          style={{
             gridTemplateColumns: `repeat(${CardCollectionView.CARDS_PER_COL}, 1fr)`,
             gridAutoFlow: 'row'
          }}>
          <div class="flex flex-col h-full items-center cursor-pointer"
            onclick={() => {
              this.current = {
                label: window.prompt('Deck label'),
                cards: new Profile.CardCollection()
              };
            }}>
            <Card facedown={true} />
            <div class="flex items-center">+ Add New</div>
          </div>
          {
            player.collection.decks.sort().map(deckName => {
              let cur = deckName == player.currentDeck;
              return (
                <div class="flex flex-col h-full items-center cursor-pointer"
                  onclick={() => {
                    let cards = player.collection.getDeck(deckName).cards;
                    this.current = {
                      label: deckName,
                      cards: new Profile.CardCollection(cards)
                     };
                  }}>
                  <Card facedown={true} shadow={cur ? 'glow-gold' : null} />
                  <div class="flex items-center">{deckName}</div>
                  {
                    !cur
                    ? (
                      <div class="flex items-center opacity-60"
                        onclick={(e) => { e.stopPropagation(); player.currentDeck = deckName; }}>
                        Make active
                      </div>
                    ) : null
                  }
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