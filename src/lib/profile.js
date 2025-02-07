class CardCollection {
  _cardsByHash = {};
  _countByHash = {};

  _decks = {};

  constructor(cards) {
    this.addCards(cards)
  }

  addCard(card) {
    if (!card) return null;
    let h;
    if (typeof card == 'string') {
      h = card;
    } else {
      h = card.hash;
      this._cardsByHash[h] = card;
    }
    this._countByHash[h] = (this._countByHash[h] || 0) + 1;
    return h;
  }

  addCards(cards) {
    if (!cards || cards.length == 0) return null;
    let byHash = {}, h;
    cards.forEach(({ card, count }) => {
      if (typeof card == 'string') {
        h = card;
      } else {
        h = card.hash;
        this._cardsByHash[h] = card;
      }
      this._countByHash[h] = (this._countByHash[h] || 0) + count;
      byHash[h] = (byHash[h] || 0) + count;
    });
    return Object.keys(byHash).map(h => ({ card: this._cardsByHash[h], count: byHash[h] }));
  }

  removeCard(card) {
    let h = card.hash;
    if (this._countByHash[h] && --this._countByHash[h] <= 0) {
      delete this._cardsByHash[h];
    } else if (!this._countByHash[h]) {
      throw `Can't remove nonexistent deck '${label}'!`;
    }
  }

  get cards() {
    let ret = [], h;
    for (h in this._cardsByHash) {
      ret.push({ card: this._cardsByHash[h], count: this._countByHash[h] });
    }
    return ret;
  }

  cardCount(card) {
    if (!card) return Object.values(this._countsbyHash).reduce((m, n) => n + m);
    return (this._countByHash[typeof card === 'string' ? card : card.hash] || 0);
  }

  setDeck(label, cards) {
    this._decks[label] = cards.map(({ card, count }) => {
      let h;
      if (typeof card === 'string') {
        h = card;
      } else {
        if (this._countByHash[card.hash] >= count) {
          h = card.hash;
        } else {
          h = this.addCard(card);
          this._countByHash[h] += count - 1;
        }
      }
      return { card: h, count };
    });
  }

  removeDeck(label) {
    if (!this._decks[label]) throw `Can't remove nonexistent deck '${label}'!`;
    delete this._decks[label];
  }

  getDeck(label) {
    if (!this._decks[label]) return null;
    let cards = this._decks[label].map(({ card, count }) => ({ card: this._cardsByHash[card], count }));
    return { label, cards };
  }

  get decks() {
    return Object.keys(this._decks);
  }

}

class Profile {
  static CardCollection = CardCollection;

  archetype;
  colletion;

  currentDeck = null;

  constructor(archetype) {
    this.archetype = archetype;
    this.collection = new CardCollection();
    let cards = this.collection.addCards(archetype.deck);
    this.collection.setDeck('Starter', cards);
    this.currentDeck = 'Starter';
  }

  get deck() { return (this.collection.getDeck(this.currentDeck) || { cards: [] }).cards; }

  get life() { return this.archetype.life; }
  get maxLife() { return this.archetype.maxLife; }
  get mana() { return this.archetype.mana; }
  get maxMana() { return this.archetype.maxMana; }
}

export default Profile;