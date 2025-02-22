import m from 'mithril';

import Constants from '../lib/constants.js';
import Util from '../lib/util.js';
import Profile from '../lib/profile.js';

import Card from './card.jsx';
import Tooltip from './tooltip.jsx';

const VIEWS = Constants.gen_enum(['PLAY', 'COLLECTION', 'DECKS']);

class LabScreen {
  currentView;

  constructor() {
    this.currentView = VIEWS.PLAY;
  }

  view({ attrs }) {
    let player = attrs.player;

    return (
      <div class="h-full w-full grid"
        style={{
          gridTemplateColumns: '10rem 1fr'
        }}>
          <div class="h-full flex flex-col border-r border-color-1 shadow p-8 gap-y-8">
            {
              Object.values(VIEWS).filter(v => typeof v === 'number').map(v => {
                let cur = this.currentView == v;
                return (
                  <div class={`p-2 cursor-pointer ${cur ? 'font-weight-bold' : ''}`}
                    onclick={() => this.changeView(v)}>
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
      case VIEWS.PLAY:
        return (<PlayView start={attrs.startEncounter} continue={attrs.continueEncounter} />);
      case VIEWS.COLLECTION:
        return (<CardCollectionView cards={attrs.player.collection.cards} filter={true} />);
      case VIEWS.DECKS:
        return (<DeckEditorView player={attrs.player} />);
      default:
        return (<div>Unknown view "{this.currentView}"</div>);
    }
  }
}

class PlayView {
  view({ attrs }) {
    return (
      <div class="w-full h-full flex items-center justify-center gap-y-8">
        <div class="flex flex-col gap-y-8" style={{ marginTop: '-25%' }}>
          <button class="p-8 text-xl" onclick={attrs.start}>
            Play
          </button>
          {
            attrs.continueEncounter
              ? (<button class="p-4" onclick={attrs.continue}>Continue</button>)
              : null
          }
        </div>
      </div>
    );
  }
}

class CardCollectionView {
  static CARDS_PER_COL = 5;
  _filters = {};

  view(vnode) {
    let { attrs } = vnode;
    let cards = attrs.cards;
    let cardclick = attrs.oncardclick || ((c) => null);
    return (
      <div class="h-full w-full">
        {this.renderFilters(vnode)}
        <div class="grid gap-x-2 gap-y-8 overflow-auto"
          style={{
             gridTemplateColumns: `repeat(${attrs.columns || CardCollectionView.CARDS_PER_COL}, 1fr)`,
             gridAutoFlow: 'row'
          }}>
          {this.filterCards(cards).map(({ card, count }) => (
            <div class="w-full h-full flex items-center justify-center">
              <div class="flex-col gap-y-2 cursor-pointer">
                <Card card={card} onclick={() => cardclick(card)} />
                <div class="text-sm text-center">x{count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderFilters(vnode) {
    if (!vnode.attrs.filter) return null;

    // TODO: filter by tags
    return (
      <div class="w-full flex py-2 border-b border-color-card">
        <select onchange={(e) => this.setFilter('rarity', e.target.value)}>
          <option value="">Rarity</option>
          {Object.keys(Constants.RARITY).map((r) => (
            <option value={Constants.RARITY[r]}>
              {Util.captialize(r)}
            </option>
          ))}
        </select>
        <select onchange={(e) => this.setFilter('tags', e.target.value)}>
          <option value="">Tags</option>
          {['attack',
            'spell',
            'life',
            'mana',
            'physical',
            'elemental',
            'dark'].map((tag) => (<option value={tag}>{Util.captialize(tag)}</option>))}
        </select>
      </div>);
  }

  setFilter(cat, v) {
    let op;
    switch (cat) {
      case 'rarity':
        op = (vv, cur) => (vv !== '') ? parseInt(v, 10) : null;
        break;
      case 'tags':
        op = (vv, cur) => (vv !== '') ? vv : null;
        break;
    }
    this._filters[cat] = op(v, this._filters[cat]);
  }

  filterCards(cards) {
    if (Object.values(this._filters).every(v => v == null))
      return cards;
    let ret = [...cards], v, get, k, ks;
    for (k in this._filters) {
      v = this._filters[k];
      if (v != null) {
        if (k.indexOf('.') == -1) {
          get = (c) => c[k];
        } else {
          ks = k.split('.');
          get = (c) => ks.reduce((o, kk) => o && o[kk] ? o[kk] : null, c);
        }
        switch (k) {
          case 'rarity':
            ret = ret.filter(c => v == get(c.card));
            break;
          case 'tags':
            console.log(ret.map(c => get(c.card)));
            ret = ret.filter(c => get(c.card).some(t => t === v));
            break;
        }
      }
    }
    return ret;
  }
}

class DeckEditorView {
  current = null;

  view({ attrs }) {
    let vw = this.current ? this.renderEditor(attrs) : this.renderDecks(attrs);
    return (<div class="h-full w-full">{vw}</div>);
  }

  renderEditor({ player }) {
    let deck = this.current;
    return (
      <div class="h-full w-full grid"
        style={{ gridTemplateColumns: '1fr 20% '}}>
          <CardCollectionView cards={player.collection.cards}
            columns={4}
            oncardclick={(c) => this.tryAddCard(c, player.collection)} />
          <div class="border-l border-color-0 grid gap-y-4" style={{ gridTemplateRows: '80% 20%' }}>
            <div class="gap-y-4 overflow-auto">
              {deck.cards.cards.map(({ card, count }, i) => {
                let tt = (<Card card={card} />);
                return (
                  <Tooltip.SideTooltip key={i} side="left" gap={10}
                    tooltip={tt}>
                    <div class="cursor-pointer p-2" onclick={() => this.current.cards.removeCard(card)}>
                      {count}x {card.title}
                    </div>
                  </Tooltip.SideTooltip>
                );
              })}
            </div>
            <div class="flex flex-col py-8 gap-y-8 h-full">
              <button class="w-full py-8" onclick={() => this.saveDeck(player.collection)}>Save</button>
              <div class="text-center py-8">
                <button onclick={() => this.discardDeck()}>Discard changes</button>
              </div>
            </div>
          </div>
      </div>
    );
  }

  tryAddCard(card, collection) {
    if (this.current.cards.cardCount(card) < collection.cardCount(card)) {
      this.current.cards.addCard(card);
    }
  }

  saveDeck(collection) {
    collection.setDeck(this.current.label, this.current.cards.cards);
    this.discardDeck();
  }
  discardDeck() {
    this.current = null;
  }

  renderDecks({ player }) {
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