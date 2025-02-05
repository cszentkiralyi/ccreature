class Profile {
  archetype;

  collection = {
    cards: [],
    gear: [],
    decks: {}
  };

  currentDeck = null;

  constructor(archetype) {
    this.archetype = archetype;
    this.collection.cards = this.collection.cards.concat(archetype.deck);
    this.addDeck('Starter', this.collection.cards);
    this.activateDeck('Starter');
  }

  addDeck(label, cards) {
    this.collection.decks[label] = { label, cards: [...cards] };
  }
  activateDeck(label) {
    if (this.collection.decks[label]) {
      this.currentDeck = label;
      return;
    }
    return false;
  }
  get deck() { return (this.collection.decks[this.currentDeck] || { cards: [] }).cards; }

  get life() { return this.archetype.life; }
  get maxLife() { return this.archetype.maxLife; }
  get mana() { return this.archetype.mana; }
  get maxMana() { return this.archetype.maxMana; }
}

export default Profile;