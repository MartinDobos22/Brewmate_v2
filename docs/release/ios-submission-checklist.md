# iOS submission checklist

Written as a list of things somebody can _check_, each with where to look. The
four the task asked about are the first four, and all four are verifiable in
this repository today.

---

## 1. Sign in with Apple works and is required

Apple rejects an app that offers a third-party login without theirs. Brewmate
offers three: email and password, Google and Apple.

- [x] `expo-apple-authentication` is in `plugins` and `ios.usesAppleSignIn` is
      `true` in `frontend/app.json` - the plugin adds the entitlement.
- [x] `AppleAuthButton` hides itself where the platform does not support Apple
      sign-in (`isAvailableAsync`), rather than failing when pressed.
- [x] `appleDisplayName` handles the fact that Apple gives a name **once**, on
      the very first authorisation, and never again.
- [x] Firebase Console → Authentication → Sign-in method → **Apple** is
      enabled, with the Services ID and key configured. _(Console, not repo -
      check before every first submission of a new Firebase project.)_
- [ ] Verified on a real device with a real Apple ID. The simulator can sign
      in, but "hide my email" only behaves realistically on device.

**Watch for:** the reviewer will use _Hide My Email_. The relayed address ends
in `@privaterelay.appleid.com`; nothing in the app may treat it as invalid.

---

## 2. Deleting the account is reachable inside the app

Required of every app that can create an account since 2022, and it must be
reachable _in the app_ - a link to a web form is a rejection.

- [x] Profile tab → account card → `DeleteAccountButton`.
- [x] `DELETE /me` erases the stored data first and the Firebase identity
      second, so a half-finished deletion cannot strand data behind an identity
      nobody can sign in as, and a retry converges.
- [x] The app signs out and empties the query cache afterwards.
- [x] The neighbouring export says plainly that deletion removes exactly what
      the exported file contains.
- [ ] Walked through on device: sign in → delete → sign in again with the same
      identity gets a fresh, empty account.

**Note for App Review:** say in the review notes where the button is. Reviewers
have a fixed number of taps of patience for finding it.

---

## 3. Permission strings are specific

Generic strings ("This app needs access to your camera") are a rejection.
Every string below names the coffee bag and what is read off it.

| Key                                 | Where                        | Text                                                                                   |
| ----------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `NSCameraUsageDescription`          | `app.json` → `ios.infoPlist` | Fotografovanie balíčkov kávy na rozpoznanie údajov o káve                              |
| `NSPhotoLibraryUsageDescription`    | same                         | Výber fotografie balíčka kávy z galérie, aby Brewmate načítal údaje o pražení a odrode |
| `NSPhotoLibraryAddUsageDescription` | same                         | Uloženie fotografie balíčka kávy do galérie, ak si ju chceš nechať                     |

- [x] `expo-image-picker`'s own `photosPermission` / `cameraPermission` plugin
      options carry the same sentences, so the two cannot drift.
- [x] No permission is requested that the app does not use: there is no
      location, contacts, calendar, microphone or notification request
      anywhere in the source.

**Watch for:** Slovak strings are correct here because the app ships in Slovak
only. If an English localisation is ever added, these need an English
`InfoPlist.strings` or the prompt will be Slovak for an English reviewer.

---

## 4. The privacy manifest is filled in

- [x] `ios.privacyManifests` in `app.json` declares six collected data types
      and four accessed API categories.
- [x] `NSPrivacyTracking: false` with an empty `NSPrivacyTrackingDomains` -
      true only because there is no advertising or attribution SDK in the
      bundle.
- [x] Required-reason APIs are declared with their reason codes: `CA92.1`
      (UserDefaults, via AsyncStorage), `C617.1` (file timestamps), `E174.1`
      (disk space), `35F9.1` (system boot time).
- [x] The declarations match `docs/app-store/privacy-nutrition-labels.md`,
      which in turn names the table or request behind each row.

**Watch for:** every SDK ships its own manifest and Apple merges them. After
adding a dependency, check the generated `PrivacyInfo.xcprivacy` in the build
rather than assuming this file is the whole story.

---

## 5. Everything else that fails a first submission

- [x] `ITSAppUsesNonExemptEncryption: false` - the app uses only HTTPS, which
      is exempt. Without this the build stalls in export-compliance questions
      on every upload.
- [x] `ios.bundleIdentifier` is set (`app.brewmate.mobile`) and matches the App
      ID in the Apple Developer portal.
- [x] Icon has no alpha channel and no rounded corners of its own
      (`assets/icon.png`).
- [x] The app is portrait-only and `supportsTablet` is `false`, so no iPad
      screenshots are required - and the reviewer will not see a stretched
      phone layout on an iPad.
- [ ] A privacy policy URL that resolves. App Store Connect accepts a URL that
      404s; review does not.
- [ ] Demo account in the review notes. Brewmate is useless signed out, and a
      reviewer who cannot get past the sign-in screen rejects on
      _Guideline 2.1_.
- [ ] The demo account has been through onboarding and has a few brews in it.
      An empty account shows the empty states, which are good screens but not
      the product.

---

## 6. Before every release, not just the first

- [ ] `pnpm verify` and `pnpm test` are green.
- [ ] The version in `app.json` is bumped. `runtimeVersion` follows
      `appVersion`, so shipping native changes without a bump would let an
      over-the-air update reach a build whose native modules it does not match.
- [ ] `EXPO_PUBLIC_SENTRY_DSN` and `EXPO_PUBLIC_RELEASE` are set in the EAS
      production profile, or crash reports arrive with no version on them.
- [ ] `EXPO_PUBLIC_API_BASE_URL` points at production, not at a laptop.
