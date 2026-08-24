# Screenshots

## What is required

| Store       | Required                                          | Notes                                                                              |
| ----------- | ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| App Store   | 6.9" iPhone (1290×2796), 6.5" iPhone (1242×2688)  | The 6.9" set is reused for every smaller size unless a size is uploaded explicitly |
| Google Play | Phone: 2 to 8 shots, min 1080px on the short side | Plus a 1024×500 feature graphic and a 512×512 icon                                 |

The app is portrait only (`"orientation": "portrait"`), so there are no
landscape sets and no tablet sets - `supportsTablet` is `false`.

## The shot list

Six, in this order. The order is the argument: what it does for you before you
have done anything, then the loop, then the thing that makes it different from
a recipe website.

| #   | Screen           | State to set up                                                            | Caption (SK)                                         |
| --- | ---------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | `/scan` verdict  | A real bag scanned, verdict expanded, reasoning open                       | Poviem ti, či ti tá káva sadne - a prečo             |
| 2   | `/brew` pre-brew | A bag chosen, a V60 selected, "dnes nemám všetko" collapsed with two ticks | Recept na tvoju kávu a tvoju výbavu                  |
| 3   | `/brew-mode`     | Mid-pour, second step, countdown running                                   | Veľký časovač, jeden krok, mokré ruky                |
| 4   | `/chat`          | Two messages and an adjustment card showing only what moves                | Povedz mi, aké to bolo. Nabudúce bude lepší          |
| 5   | `/insights`      | An account with ~20 brews, a suggestion card visible                       | Čo hovorí tvoja história - v počtoch, nie v známkach |
| 6   | `/dial-in`       | Three shots in the timeline, one change proposed                           | Espresso: jedna zmena na jeden šot                   |

## Rules for the captures

- **Real data.** A screenshot of Lorem Ipsum coffee is a screenshot of a
  product that does not exist. Use bags that were actually bought.
- **Both schemes.** Capture light; the store shows one set, and light reads
  better as a thumbnail. Keep the dark captures for the marketing page.
- **No invented numbers.** If the confidence notice is showing, leave it
  showing. Cropping out the app's own caveat to make a screenshot look more
  certain is the one thing this product should not do to sell itself.
- **Status bar.** Full battery, full signal, 9:41 - `xcrun simctl status_bar`
  on the simulator sets all three.

## How to capture

```bash
# Simulator, 6.9" - iPhone 17 Pro Max or whichever is current
xcrun simctl boot "iPhone 17 Pro Max"
xcrun simctl status_bar "iPhone 17 Pro Max" override --time "9:41" \
  --cellularBars 4 --batteryLevel 100 --batteryState charged
pnpm --filter @brewmate/frontend run ios
xcrun simctl io booted screenshot shot-1.png
```

Android: `adb exec-out screencap -p > shot-1.png`, with demo mode on
(`adb shell settings put global sysui_demo_allowed 1`).
