---
title: "Raccoon Heist devlog #1: one night works"
description: "What Raccoon Heist is, what already plays, and what the current milestone adds."
pubDate: 2026-10-21
type: devlog
tags: [raccoon-heist, devlog]
game: raccoon-heist
number: 1
cover: "/devlog/devlog-01-cover.png"
coverAlt: "Rocco the raccoon, a coin pouch on his belt, stands on the casino carpet between two rat thugs in black suits, while a dice goon hops past slot machines and a roulette table."
coverLabel: "Concept art"
draft: false
---

<!-- Image slot D1-1 (cover): Raccoon Heist key art. Label: Concept art. -->

A small-time raccoon thief wins the worst casino in town from the Rat Mob in a rigged card game. Then he learns the catch: the casino sits on the Rat Boss's turf, and protection money is due every night.

That's Raccoon Heist. This is the first devlog.

## What it is

Raccoon Heist is an active incremental roguelite in 2D isometric pixel art. It's on PC first, headed to Steam.

You play Rocco "The Bandit". Every night the Rat Mob sends its boys to wreck the place: rat thugs in black suits and walking dice. Rocco fights with a deck of cards. Knocked-out goons drop coins, and the coins go in the sack.

At the deadline Don Vermino, the Rat Boss, comes for his money. Pay, and the casino is yours for another night. Come up short, and the deed goes back to him.

One rule drives everything: **every click is a bet**. Gold you spend on powers and machines is gold the Boss doesn't get, so it had better pay.

![Rocco the raccoon, a rat thug in a black suit, a walking dice goon and Don Vermino in a pinstripe suit, in pixel art, side by side at in-game size.](/devlog/cast-lineup.png "The cast, at in-game size. | Concept art")

## What works today

- **Moving and fighting.** Your cursor steers Rocco and he attacks on his own. The frequent work is automatic, so your clicks stay rare and worth something.
- **A full night.** Waves of goons, a clock running down to the deadline, and a protection-money bar that fills as you earn. At the deadline you pay or go bankrupt.

The deadline is tense and the movement feels right. What a night needs next is choices: things worth spending on between paydays. A deadline with no choices is just a timer.

So the current milestone is about choices.

## A call we made early

Before committing, we prototyped in both 3D and 2D. The 2D isometric prototype ran at 120 FPS and matched the art direction, so that's the game.

![Rocco the raccoon in his red vest, running in a loop, in pixel art.](/devlog/rocco-run.gif "Rocco, running. | Concept art")

## What's next

The current milestone is about feel and the first real bets.

- **Effects.** Every hit, crit, knockout, coin and pickup gets feedback you can read at a glance.
- **Three powers:** Double Down, Jackpot Bomb and All In. Big, rare clicks you save for the right moment.
- **A slot machine** on the casino floor. The Mob rigged these years ago. Rocco knows how to make them pay him instead.
- **Lockboxes.** Shiny enemies sometimes drop one. Stand close and it opens, no click needed. Inside: a gold burst, a power charge, or a moth.

Then I play it again. The question for that playtest: do clicks feel like bets?

After that come charms, the Boss's Deal (his best cards come with a catch), and the first room you can buy for the casino between nights.

## How the art gets made

Every character has one canonical model sheet. Sprites are generated from those sheets with AI assistance, then our pipeline snaps them to the game palette, aligns every frame to one scale and floor line, and fails the build if anything drifts. The next devlog walks through it, start to finish.

See you after the playtest.

Esteban
