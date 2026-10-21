---
title: "Raccoon Heist devlog #2: how a character gets made"
description: "From a canonical model sheet to an 80-pixel sprite on the casino floor: the five steps every Raccoon Heist character goes through."
pubDate: 2026-10-21
type: devlog
tags: [raccoon-heist, devlog, art]
game: raccoon-heist
number: 2
cover: "/devlog/cast-lineup.png"
coverAlt: "Rocco, a rat thug, a dice goon and Don Vermino in pixel art, standing on one floor line."
coverLabel: "Concept art"
draft: false
---

<!-- Queued follow-up, not a launch post. Publish about two weeks after launch, or alongside the first playtest post. -->

Every character in Raccoon Heist goes through the same five steps before it reaches the casino floor. Same steps for the hero, the goons and the Boss. Here they are, using the cast as the example.

![Rocco the raccoon, a rat thug in a black suit, a walking dice goon and Don Vermino in a pinstripe suit, in pixel art, side by side at in-game size.](/devlog/cast-lineup.png "The cast at in-game size. | Concept art")

## 1. One canonical sheet

A character starts as a model sheet: front, three-quarter and back views, plus the expressions it needs. I approve it, and from then on it is the only reference that counts. Every asset with that character in it, in the game, on this site or on a store page, gets checked against it.

The sheet comes with two short lists: what the character must read as, and what it must never look like. Rocco must read as a sly con man: half-lidded eyes, a cocky one-sided grin, grey fur, a black mask, an open red vest. Never round wide eyes, never a hat, never brown fur.

That second list does more work than it looks. It turns "doesn't feel like him" into something you can check.

## 2. Generated from the sheet, never from text alone

Sprites are generated with AI assistance, always from the canonical sheet plus a fixed style guide and a prompt. Never from a text prompt alone.

Each animation is one strip, with every frame's pose named: contact, down, passing. A vague "run cycle" gets you shuffling legs; named poses get you a run. No more than three or four frames per image, on a flat chroma background so the pipeline can lift the character off cleanly.

For cycles where limb timing matters, frames are made one at a time: take a good frame, keep everything identical, and change only the legs.

## 3. The pipeline decides what ships

Generated art is raw material. A pipeline in the game's repository turns it into sprites, and it is strict.

- **Palette.** Every pixel snaps to the game's fixed palette. When the image shrinks to sprite size, each new pixel takes the most common colour in its block, so no in-between colours get invented. Each character also has its own allowed colours, and a few it may never use.
- **Outline.** One pixel of ink around the silhouette, the same weight on every character.
- **Scale.** The character's size comes from its head, measured across the reference frames. A crouch or a stretch never resizes him.
- **Floor.** Feet land on one baseline, centred on the body, so nothing slides sideways between frames. Jumping frames keep their height off the ground.
- **Checks.** The build fails, and no sheet is written, if a head changes height within an animation, if standing poses differ in height across animations, if a colour falls outside the character's palette, or if the frame count is wrong.

Any asset rebuilds from its raw images with one command. If the rules change, everything regenerates under the new rules.

![A rat thug in a black suit walking in a loop, in pixel art.](/devlog/thug-walk.gif "Rat thug, walking. | Concept art")

## 4. The Art Review page

Passing the checks gets a sprite onto the Art Review page, a small local tool built for this. Every sheet plays there at real speed. You can slow it down, step frame by frame, mirror it, turn on onion skin to see every frame stacked, and draw the baseline and the real floor colour underneath.

Each sheet gets Approve or Needs work, with notes. A note doesn't stay a note: it becomes a rule in the art direction, and every later asset is reviewed against it. The rulebook has eleven rules so far. A few of them:

- Characters shown together share one scale and one floor line.
- Judge at real size, on the real floor colour. If a face doesn't read there, it doesn't read.
- Motion is natural: upper body stable, legs alternating, no jitter between frames.
- Clean edges. Nothing left over from generation.

![A dice goon with a toothy grin hopping in a loop, in pixel art.](/devlog/dice-hop.gif "Dice goon, hopping. | Concept art")

## 5. On the casino floor at 80 pixels

The game draws at 1920×1080 internally, and characters stand about 80 pixels tall. That leaves room for a narrowed eye and a one-sided grin, which is the whole of Rocco's personality. It's still pixel art: one pixel size, flat fills, hard shadows.

The game's logic doesn't count in screen pixels. It works in its own units, with one number for how many pixels each unit gets. Pixel density is a setting and a pipeline rebuild, not a rewrite.

![Don Vermino, the Rat Boss in a fedora and pinstripe suit, talking while he toys with a gold watch, in pixel art.](/devlog/vermino-talk.gif "Don Vermino, making an offer. | Concept art")

## Who does what

AI generates from the sheets. The pipeline enforces the rules. I approve every canonical sheet and review every asset on the Art Review page. Art made this way is labelled concept art here.

Next up: the playtest, and whether clicks feel like bets.

Esteban
