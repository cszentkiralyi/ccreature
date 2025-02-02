ARPG Card Game
==============

Tentative name: "Creature" stylized CCREATURE

1 Basic concept
---------------

A roguelite deckbuilder featuring ARPG affixes on cards.

### 1.1 Common tropes

- Combat via turn-based card game
- Deck customization
- Randomly-generated dungeons
- Permadeath (optional?)

### 1.2 Differences

- Cards are not fixed, they start from bases
- Rewards are common and frequent, curated by loot filters

2 Gameplay loop
---------------

### 2.1 Overworld

Outside of encounter sequences, players have the opportunity to manage their
cards, gear, and stashes. They may do so for an unlimited time, making unlimited
changes, like traditional ARPG towns or hideouts allow.

Selecting an encounter sequence locks the player out of this mechanic and begins
the sequence.

### 2.2 Encounter sequence

These are analogous to ARPG zones, represented as **short** linear dungeons where
each room contains some form of encounter. Succeeding an encounter rewards the
player, but whether the player can partially-succeed a sequence is TBD. The player
then progresses to the next encounter repeatedly until the sequence ends.

### 2.2.1 Combat encounters

- The player must reduce an enemy's life to 0 to succeed
- The player fails if their own life reaches 0
- Each turn, the player plays 1 card and the enemy plays 1 card; this is
  modified by speed

#### 2.2.1.1 Enemies

Types:

- Boss - nonzero speed, unique decks, multiple phases, and maybe even
  AI that can combo cards or something to really fuck you
- Rabble - simple decks (represents a pack of inconsequential enemies)
- Elite - simple decks but stronger and synergizing with rabble

Non-Boss enemies can have affixes to make them rare or magic.

Encounter sequences can add modifies to all enemies.

### 2.2.2 Other encounters

I have no idea, but it can't be all combat, right?

3 Ideas workshopping
--------------------

### 3.1 Game mechanics

#### 3.1.1 Mana system

Cards cost mana to play. By default the player has some mana regeneration,
which restores a fixed amount of mana at the start of a turn. Cards can
restore mana, and since they can be autoplayed, that means more mana regen
can be achieved by autoplaying mana-restoring cards. The same applies to
life.

#### 3.1.2 Difficulty

If cards rain down on the player, how is difficulty presented aside from
just the RNG of finding appropriate cards?

- Deck size limit?
- Attribute requirements for cards?
- Gear?

#### 3.1.3 Keywords

- Resources: life, mana
- Damage methods: attack, spell
- Damage types: physical, elemental, dark
- Defenses: armor, parry, dodge, resist
  - Armor: always reduces physical damage taken
  - Resist: always reduces non-physical damage taken, and reduce the
    duration of debuffs
  - Parry: large chance to reduce damage taken
  - Dodge: small chance to avoid damage
- Debuffs: stun, afflict, slow
  - Stun: pass N turns
  - Afflict: deal N damage of a type over time somehow
  - Slow: additive N/X chance to pass a turn (X TBD)
- Mechanics: autoplay, restore, speed, area, draw
  - Autoplay: played instantly on draw
  - Restore: gain N resource
  - Speed: play N additional cards per turn
  - Area: affects N additional enemies
  - Draw: draw N cards

#### 3.1.4 Attributes

Should these exist? If so, 3 make sense:

- Strength: aligned with attacks, physical damage, and armor
- Dexterity: aligned with attacks/spells, elemental damage, and parry
- Intelligence: aligned with spells, dark damage, and dodge

It would also follow that something would be tied to these, either
gear (if it exists) or cards would have attribute requirements and
they would somehow provide benefits to their respective mechanics.

Classes: The Meat (Str), The Hands (Dex), and The Brain (Int)

#### 3.1.5 Gear

Does gear make sense? If so, a subset of traditional slots:

- Armor
- Weapon
- Amulet
- Ring

Gear would provide:

- Base life & mana
- Base defenses
- Attributes
- Percentage boosts

#### 3.1.6 Levels & XP

Possible idea: leveling up grants life, base attributes, and widens the
deckbuilding window. By default, the player's class determines their base
life and attributes (and starting deck), but all level 1 characters have
the same deck restrictions of requiring a number of cards in some range
(e.g. no fewer than 10, no more than 12).

Encounters award XP and after a few encounter sequences, the player levels
up which grants some additional base life and attributes, and allows them
to include fewer or more cards than before (e.g. 10-12 -> 10-15 -> 8-15).

### 3.2 Affixes

Affixes essentially mimic ARPG affixes:

**Note:** I'm not happy with the "target" terminology here, that doesn't quite
capture the purpose of that section of an affix...

- An affix is an action keyword, possibly with magnitude and target
  1. "Restore 10 Life" is the "restore" action, magnitude 10, and targeting
     "life"
  2. "20 Elemental Attack" is the "attack" action, magnitude 20, target
     "elemental" (which in this case means the damage type dealt to the combat
     target, I guess)
  3. "Autoplay" is an action on its own
  4. "Speed 2" is the "speed" action with magnitude 2
  5. "20% increased Dark Attack" is the "attack" action, magnitude 20, 
     target "dark," and effect "increased" (additive percentage)
- Affixes are categorized, tiered, and exclusive (but to what degree?)
  - Not all affix groups will have the same amount of tiers
  - Each individual affix (a tier within a group) has a unique name, which is
    used to rename/update cards -- but this **must** be predictable and repeatable
    to avoid confusion, two cards with identical affixes must generate identical
    names
- All cards begin life as a prefix

### 3.3 Setting/theme

It is the far future and humans have colonized the galaxy. We are alone, we are
legion, and we are bored. The player is a science experiment that repurposes
biological matter into itself. The ARPG gear slots are hidden under a veneer of
sci-fi DNA bullshit, farming is explained by the near-unlimited variety of humans
in near-infinite different systems. The player is assumed to be a sociopath that
wants to kill things and get stronger, so the scientists direct the creature on
quests to slay specific powerful beings in between its ravaging of the human
worlds.

At no point does anybody give a shit.

#### 3.3.1 Flavor text

- Spell: "What? Magic? No, we've told you. It's a sort of integreated synthopsionic
  pulse emitter implant mesh configured to-- you know what, fuck it. Yes, it's
  magic."
- Dark: "There's that old thing about saying you understand quantum physics means
  you don't know anything about quantum physics, did you ever hear that? The boys
  here don't even pretend to know what you're doing, but it's some spooky shit."
- Life: "Don't you start getting all philosophical on us. Focus up."
- Mana: "The PAHARS [Passive/Active Autonomous Recharge System] network we wired up
  is a decent start but it wasn't designed for this much strain."
- Loot filter: "You say 'card,' we say 'low-resonance variable ratio microsegment
  response,' who gives a shit. Tell us what you want to see and the boys will make
  it happen."
- Speed: "The autotoxicology limitation progression is absurd, but if it's working
  for you then keep it up. We've got a pool going on how long supersaturation can
  be maintained and this might settle it."

#### 3.3.2 Opening flavor

IT IS THE FAR FUTURE. HUMANITY HAS COLONIZED THE GALAXY AND FOUND NO OTHER LIFE.
THERE IS NO WONDER, THERE IS NO PROGRESS, THERE IS ONLY APATHY AND BOREDOM ACROSS
INFINITE SOLAR SYSTEMS.

YOU ARE CCREATURE, A GENETIC MANIPULATION EXPERIMENT. GO FORTH AND CONSUME.