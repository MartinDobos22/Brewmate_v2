# Going live

The order things have to happen in to put Brewmate in front of a stranger. Each
step is either done in a console somebody has to own an account for, or it is
already in this repository and only has to be pointed at production.

The two detailed documents this one leads to are
[`backend-hosting.md`](./backend-hosting.md) for the API and
[`eas.md`](./eas.md) for the builds; the reasons a first submission fails are
in [`ios-submission-checklist.md`](./ios-submission-checklist.md).

---

## 0. The accounts, and what they cost

Nothing below can start until these exist, and two of them take days rather
than minutes - Apple's enrolment is verified by a human, and a Play developer
account has been known to sit in review for a week.

| Account                 | Cost                    | Needed for                                     |
| ----------------------- | ----------------------- | ---------------------------------------------- |
| Apple Developer Program | 99 USD / year           | TestFlight and the App Store                   |
| Google Play Console     | 25 USD once             | Play, including internal testing               |
| Expo (EAS)              | free tier, then monthly | Builds and over-the-air updates                |
| Neon                    | free tier is real       | The production database branch                 |
| Firebase                | free tier is real       | Authentication and the Cloud Storage bucket    |
| Anthropic               | usage                   | Everything the app asks a model                |
| A host for the API      | ~7 USD / month          | Render, from GitHub - see `backend-hosting.md` |
| A domain                | ~10 USD / year          | `api.brewmate.app`, and a privacy policy URL   |

Sentry is optional and has a free tier; without a DSN the app and the API
report nothing anywhere and work exactly as well.

## 1. A production Firebase project

Separate from whatever was used while building. Identities do not move between
projects, so this is the last comfortable moment to decide.

- [ ] Authentication → Sign-in method: **Email/Password**, **Google**, **Apple**
      all enabled. Apple needs a Services ID and a key from the Apple Developer
      portal, and it is the one that fails silently until a real device tries it.
- [ ] Cloud Storage bucket created, and its rules written so a signed-in user
      can upload. Without a bucket the app hides the camera and the scanner
      falls back to the form, which works but is not the product.
- [ ] A service account key generated for the API (Project settings → Service
      accounts). This is the private key that goes into the host's secrets and
      nowhere else.
- [ ] The iOS bundle identifier (`app.brewmate.mobile`) and the Android package
      registered as apps in the project, so the client configuration matches the
      builds.

## 2. The database

- [ ] A production branch on the Neon project, separate from development and
      from test.
- [ ] `node dist/db/migrate/migrateCli.js` against it (or `pnpm db:migrate`
      with the production URL in the environment, before there is a deployment).
- [ ] `node dist/db/seed/seedCli.js` once - the eighteen brewing methods and the
      grinder catalogue. An empty `brew_methods` is an app that cannot brew.

## 3. The API

Connect Render to this repository - `render.yaml` is the whole service - fill in
the secrets, deploy, then verify from outside rather than from the platform's
dashboard:

- [ ] `curl https://api.brewmate.app/health` answers `{"status":"ok"}` with the
      database `up`.
- [ ] A request with no token answers 401 in the shared error envelope, and one
      with a real Firebase ID token answers `/me` with a user row.
- [ ] `ANTHROPIC_API_KEY` is set, and a scan of a real bag comes back read
      rather than 503.
- [ ] The domain in `frontend/eas.json` resolves to it.

## 4. The builds

- [ ] `EAS_PROJECT_ID` and `EAS_OWNER` exported, `eas init` run once.
- [ ] The production profile's environment variables set in EAS - the Firebase
      client configuration, the storage bucket, the Google client IDs,
      `EXPO_PUBLIC_SENTRY_DSN` and `EXPO_PUBLIC_RELEASE`. They are not in the
      repository on purpose; `eas.md` says why.
- [ ] `ascAppId` and `appleTeamId` filled into `eas.json` (both are placeholders
      in the repository).
- [ ] `pnpm verify` and `pnpm test` green, the version in `app.json` bumped.
- [ ] `eas build --profile production --platform all`.
- [ ] The build installed on a real device, signed into with Apple **and** with
      Google, and taken through onboarding to a first brew. Both social logins
      need a real build - neither works in Expo Go.

## 5. The store material

Everything under `docs/app-store/` is written to be pasted:
[`listing-sk.md`](../app-store/listing-sk.md) for the text,
[`screenshots.md`](../app-store/screenshots.md) for the six shots and the order
they argue in, [`privacy-nutrition-labels.md`](../app-store/privacy-nutrition-labels.md)
for the privacy answers - each row of which names the table or the request that
makes it true.

- [ ] A privacy policy at a URL that actually resolves. App Store Connect
      accepts a URL that 404s; review does not.
- [ ] A support URL or address.
- [ ] The nutrition labels and the Play data-safety form filled in from that
      one document, so the two cannot say different things.
- [ ] A demo account for review, that has been through onboarding and has a few
      brews in it, with its credentials and the location of the delete button in
      the review notes. Brewmate is useless signed out, and a reviewer who
      cannot get in rejects on Guideline 2.1.

## 6. Submitting

- [ ] `eas submit --profile production --platform ios` → TestFlight → App Store
      Connect.
- [ ] `eas submit --profile production --platform android` → internal testing
      track first, then production.
- [ ] Walk `ios-submission-checklist.md` end to end. Its first four items are
      the ones that fail a first submission, and all four are already true in
      this repository - the ones left unticked are the ones only a console or a
      device can answer.

## 7. After it is out

- [ ] Crash reports arriving with a version on them - that is what
      `EXPO_PUBLIC_RELEASE` is for.
- [ ] `GET /ai-usage/summary` watched for the first week. The per-account
      ceilings protect against a runaway screen; they do not cap what a hundred
      accounts cost.
- [ ] An over-the-air update for a Slovak sentence or a wrong number
      (`eas update --channel production`), a store build for anything that
      touches a native module. `runtimeVersion` follows `appVersion` precisely
      so the first cannot be mistaken for the second.
