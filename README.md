# CCREATURE

Hobby project fusing deckbuilder with ARPG. Not likely to be fun. Currently
under sporadic development and remains highly incomplete.

## How to run

If you can read a `package.json` just do that.

- `npm run build && npm run serve` to host on `localhost:1234`
- `npm run dev` has hot-reloading

### Deps notes

- `mithril` is a teensy React that also does our routing
- `parcel` is the entire build pipeline
- `serve` is just for serving the minified build

## How it will work

- [ ] Class selection: starting deck, leveling bonuses
- [x] Card generation: affix-based ARPG-style items
- [x] Encounters: combat via cards, rewarding more cards
- [x] The Lab: deckbuilding, collection viewing
- [ ] Encounter sequences: short "zones" of encounters culminating in
      some kind of elite/boss
- [ ] Gear system: TBD
- [ ] Sane "campaign" + "endgame" scaling: unlikely
- [ ] Story, lore, flavor, and pretty UI: pipe dream
