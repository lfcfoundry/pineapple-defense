# Changelog

What changed in each version of Pineapple Defense, in plain words. Version stamps use `year.month.day.HHMM` (US Eastern). Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE).

Developers: [CHANGELOG-DEV.md](CHANGELOG-DEV.md) has the same versions in three depths (Quick, Details, Deep). Each release below lists the browsers it was tested in; where that was not recorded it says so.

## @VER@
- Aim help and Sticky aim are gone from Settings. A flick now goes where you point it, with no extra forgiveness and no last-target memory (it used to be on Normal by default). Little hands setup no longer changes aim.
- The counters at the top take up less of the picture: the pause button now sits at the end of the stage progress bar and the four counters (Left, Combo, Golden Pineapples, trophies) share one row, so the top block covers 15% of the play area instead of 24%. Left-handed mode mirrors it.
- Behind the scenes only: the check that keeps the drawing work per frame in bounds now uses the shared canvas-probe tool from JS-modules (also checks that nothing is left half-saved). The game itself is unchanged.
- The speed badge (shown only when you turn on the FPS counter in Settings) now sits above the throw buttons, so a long hitch message can no longer cover the Lobber button on a narrow screen.
- GNOME Web is no longer one of the test browsers; checks run in Chromium, Firefox and WebKitGTK.
- The built-in pictures are packed a little tighter (about 4% smaller, 65 KB) with the same quality setting, so the page is 86 KB smaller. The game looks the same (every picture check passes at 100%).
- The game uses about 39 MB less memory on a phone: once the smaller copies of each picture are made, the big 384 pixel copy (never drawn that large on a phone-sized screen) is let go, and it is decoded again if the window is made large. The pictures are exactly the same.
- New picture check tool, `tools/picture_gate.py`: compares two builds of the game in all four test browsers in about 80 seconds instead of the 3 minute full run, for changes that should not alter how anything looks.
- The built-in pictures are 36 KB smaller: a color profile that every one of the 77 pictures carried (and the game never used) was removed. The pictures look exactly the same (every pixel identical), and the page is about 228 KB smaller, so it is read a little sooner (Chromium start-up about 19% quicker).
- Going to the next stage is quicker: while the "Stage clear" card is open the next stage's background is drawn in three small steps in the background, so pressing Next stage only swaps it in. The picture is exactly the same. Stage start work went from about 8 to 11 ms down to about 6 ms on a normal computer, and about 4 times that on a slow phone.
- In Chrome and other Chromium browsers the first stage no longer freezes the screen while the pre-drawn pictures are prepared: that work now runs in background helpers. On a phone-speed test the longest freeze at the first stage start dropped from about 290 to about 110 ms, and on a normal computer from about 70 ms to none long enough to notice. The picture is exactly the same.
- The hidden report panel now shows the right game version (shared field-report 1.0.2).
- Fixed: if the browser refuses full screen from the Settings card, no hidden error is raised any more.
- Fixed: tapping the stage, the pause button or a number key in the split second after pressing Play (before the stage had appeared) raised a hidden error. Those taps are now ignored until the stage is ready.
- Fixed: closing the Settings card within a third of a second of switching full screen raised a hidden error.
- If your device cannot keep up, the game now lowers the picture sharpness one step at a time using the shared FX governor, and it never raises it again on its own in the middle of a run. Starting or continuing a run begins at full sharpness again. Battery saver uses a lower speed line so it is not blamed for its slower pace.
- The first stage you start in Chrome and other Chromium browsers begins about a third quicker, because the pre-drawn pictures are used as they come instead of being copied once more. The picture is exactly the same.
- Opening and closing a card on the title screen (How to play, Settings, the Welcome tour) no longer makes a small hitch: it is about ten times quicker, so the tour and the cards appear without a stall on a phone.
- The game opens sooner on every browser: the page itself is now the compact version of the file (about a fifth quicker to start, and more on a slow phone). Nothing you see changes.
- A hidden helper for "it felt slow": tapping 5 times quickly in the top-left corner opens a small panel with Save speed report (start-up time, FPS, the slowest moments, in plain words) and Save error log (anything that went wrong). Each saves one small file; nothing is ever sent anywhere. This replaces the earlier 7-tap credit-line panel; the 25 second helper-played Speed check now lives only in the Test Lab build.
- Starting a stage is about twice as quick (the background was being drawn twice), so there is less of a hitch when a stage begins. The picture is exactly the same.
- The page now allows background workers started from inside the file, ready for heavier work to move off the screen's thread. Nothing you see changes.
- The game opens a little sooner, because the single file now unpacks faster.
- The game's pictures (fruit, plants, gear) now come pre-drawn inside the file, so the first screens show up sooner and the page stays more responsive while they load, most of all in Chromium and Firefox. The file is about 1.6 MB bigger. They look the same to the eye.
- Smoother in Firefox, with no change to how the game looks.
- Frame rate is written as FPS everywhere, and the speed badge reads "60 FPS".
- **Tested in:** ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5 (quick check, one at a time, passed in 83.6 seconds); picture match against the old drawing at least 99.55% in all four. Not a release yet: the stamp comes with the next release.

## 2026.10.17.0716
- New Device check in the tester build: one button plays 20 seconds of the game and says in plain words whether your device runs it Smooth, Mostly smooth, Choppy or Slow.
- Slow phones are now called Slow, not Smooth, and the game lowers its picture quality sooner on very slow devices.
- The speed badge ignores the pause when you come back to the tab.
- Sharper outlines on the logo and the stage banners.
- Floating words such as Zippy! and Toasty! are easier to read.
- **Tested in:** ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (MiniBrowser) (one at a time); the shipped minified page: ungoogled Chromium 155.0.8059.39.

## 2026.10.16.1720
- Held sideways on a phone, the title buttons and menus sit in the side margins so nothing is cramped.
- New Roomy letters setting (off by default) spreads out the letters, words and lines.
- A soft plate behind the top counters keeps the numbers readable over busy art.
- The game moved to its new home at https://github.com/lfcfoundry/pineapple-defense (play page https://lfcfoundry.github.io/pineapple-defense/).
- **Tested in:** Chromium 141.0.7390.37 (the stock Playwright build, not ungoogled) for the full release run; no Firefox run for this release, because the cloud machine could not install Firefox then. Phone not tested.

## 2026.10.15.1102
- Now released under the MIT license as "Forged by LFC Foundry", with the credit on the title screen.
- **Tested in:** Chromium (version not recorded) and Firefox 158 through the release tool; the first release run had one Firefox timing flake (the FPS badge overlapping a pick) that passed on rerun.

## 2026.10.14.1352
- Sideways play is roomier: the counters and buttons move into the empty side margins.
- Shorter waits on stages you have already cleared.
- The red danger glow around a penguin close to your stand is on for everyone (you can still turn it off in Settings).

## 2026.10.14.1334
- The shop tells you what is missing when you cannot buy something yet ("Need 30 more", "Needs Slingshot").
- Shop and Pause buttons are bigger.
- Reset is now a quiet link that needs a hold to confirm, and it can be undone.
- The bars around the game match the stage with a soft color wash.
- A tap skips the get-ready beat after Resume.
- Any button shows a soft ring the moment a finger lands.
- New Every finger plays setting (off by default), so a second finger can throw while another rests on the screen.
- Tester build: a Flash check counts big brightness flashes and gives a plain verdict.

## 2026.10.14.1256
- New Keep screen on setting (on by default) stops the screen from dimming while you play.
- A Champion's tip shows only until you have beaten that Champion once.
- After losing the same wave twice, the game kindly offers a little help.
- A second copy of the game in another tab plays without saving and says so, so nothing gets overwritten.
- If the picture drops out, the game pauses, keeps your place and offers Reload.
- Tester build: a Color view button shows the game as a color-blind player sees it.

## 2026.10.14.0817
- On Android, the back swipe or back button pauses the game instead of leaving the page.
- A tab the browser threw away comes back where you left off.
- New Little hands setup in Settings: one tap turns on the easiest controls.
- New game-feel settings to try: Hit pause, Screen shake and more.
- New For grown-ups card: no ads, no purchases, no accounts, no network, and what is saved and how to clear it.

## 2026.10.14.0743
- A new game asks how you want to throw: Flick or Tap.
- Touches just outside the Classic and Lobber buttons and the pause button now count, so thumbs at the screen edge work.
- With Large buttons on, the Pineapple Rain button no longer overlaps the cheer bar.
- New Early flick helper setting (off by default): a flick made just before the sling is ready is thrown the moment it is ready.
- The speed badge now gives a plain-words verdict such as "smooth".
- Fonts download about 30% smaller.

## 2026.10.13.2220
- New Tap or hold to throw setting for the youngest players (off by default).
- New FPS counter setting (off by default): a small badge shows how smoothly the game is running.

## 2026.10.13.2111
- The Settings screen was redone in the style of Fancy, the Banana, with big rows, one-line help and an On/Off pill for each option, plus a Game speed setting.
- A warning appears if the browser refuses to keep your saved game.

## 2026.10.13.2059
- The "You did it!" card now has Save and go to title.

## 2026.10.13.1645
- New first-time tour with five short picture cards.
- The main slingshot tilts only a few degrees, like the helper slingshots. Throws still go exactly where you aim.
- The Classic and Lobber buttons are short, wide pills that cover less of the lane.
- Nothing is thrown during the Champion's Ready, Set, GO.
- Stage 2's flip-flops look like flip-flops.
- Every stage opens with its name.

## 2026.10.13.1614
- Penguin props are rarer, so a full outfit is a treat to spot.
- Every trophy, upgrade and pickup has its own icon.
- New logo: the little penguin wears a beanie and scarf.
- New README written for players, with screenshots.

## 2026.10.13.1537
- Pineapple Roll rims have a rounded lip, so a ball can rattle around the edge and drop in.
- Penguins dress up in hats, scarves, mittens and held items.
- Stage 4 (the storm) gets a sweeping lighthouse beam and a cloud that smiles when tapped.
- Stage 5 (the fortress party) gets balloons to pop, a disco ball, a snowman DJ and fireworks.
- The progress bar starts with the stage label.

## 2026.10.13.1452
- The Auto Slingshot is now a helper: it tosses slower and sometimes misses.
- A progress bar across the top shows each wave and the Champion.
- A Gentoo that eats another fish becomes a mecha penguin with armor.
- More fish in waves 4 and 5 of every stage.
- Prettier scenery on every stage: drifting light, cloud shadows and snow puffs.
- All the words are kid-friendly.
- Pineapple Roll rolls faster and its last ball gets a chase camera and a fairground backdrop.

## 2026.10.13.1405
- While a Champion strolls out, the banner says Ready..., Set..., GO!, and he cannot be hurt until GO!.
- The helper slingshots wait until you throw your first pineapple each round.
- Pineapple Roll can be played twice per run.
- Pineapple Roll is easier to flick.
- Bug fixes and a speed check with every upgrade switched on.

## 2026.10.13.1256
- Champion fights are different now: each Champion has its own way of fighting.
- Pineapples fly farther on a hard flick, and a miss lands with a puff and stays put.
- Limes leave a vapor trail and spin like a football.
- The Auto Slingshot and Lime Launcher no longer lean far to the side.

## 2026.10.13.0956
- The Lime Launcher upgrades now give you more limes per fight: 6, 12 and 20.
- No more stutter the first time an umbrella shows up.
- Gulls swoop lower and are a little bigger.

## 2026.10.13.0008
- New comfort settings: left-handed layout, aim help, high contrast and more.
- The shop has a Try it button and an Undo button.
- Replay any cleared stage from the title screen without touching your saved run.
- The game draws noticeably less per frame, so it runs smoother.

## 2026.10.12.2343
- New shop item: the Lime Launcher, a small green slingshot with three tiers.
- Nicer penguins, Champions, pineapples and icons.
- The game runs faster.

## 2026.10.12.2307
- The run-end card has Save and restart (keeps your upgrades) and Reset completely (asks first).
- A fix so the Air Raid line lands mid-field when no penguins are near.

## 2026.10.12.2253
- New shop upgrades: Gull Pals, Paper Umbrellas and Air Raid.
- Combos grow with the chain, with rays, rings and confetti.
- Every finished run makes penguins and Champions a little faster, adds a new challenge and new trophies (21 in all).
- Pickups and trophies arrive with sparkles.
- A redrawn slingshot, and one bank counter in the top bar.

## 2026.10.12.2223
- Harder, more distinct Champions, a Champion health bar, new lane art for every stage, secret tap spots and Toasty! instead of Brrr!.

## 2026.10.12.2205
- The bank shows live prices, Champions block their lane, and parachute fish evolve penguins.

## 2026.10.12.2112
- Five stages of five waves, with stage scenery and five Champions.

## 2026.10.12.1918 to 2026.10.12.2020
- More top counters, a vertical Cheer meter, labeled pineapples and pickups, a pickup guide and a long run of polish and fixes.

## 2026.10.12.1726 to 2026.10.12.1752
- A tall stage, table power-ups and trophies, the Auto Slingshot, animated scenery, a packed single-file build and a new logo.

## 2026.10.12.1655 to 2026.10.12.1712
- First playable stage 1: five lanes, waves, Rockhopper and Adélie penguins, Classic and Lobber pineapples, the Cheer meter, pause, end cards, Calm mode, saves with Continue, flick throwing and Coach Waddles.

## 2026.10.12.1556
- First title screen, logo and original pineapple and Rockhopper sprites.

Releases before 2026.10.15.1102 were checked in Chromium and Firefox 158 through the release tool; which ones had the Firefox run, and the Chromium versions, were not recorded.
