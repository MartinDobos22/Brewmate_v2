# Brewmate

A mobile companion for brewing specialty coffee. This repository is a pnpm
workspace holding the mobile app, the API and the contract they share.

**Current state:** monorepo skeleton + working backend + mobile app with
authentication, plus the complete data layer: the PostgreSQL schema, the REST
API for every entity and the TanStack Query hooks that talk to it. The
reference data is filled in - the brewing methods and the grinder catalogue -
and the product UI now covers the whole first run: the grinder catalogue, the
onboarding flow (taste questionnaire, equipment, water, sets, a calibration
brew) and the profile screen it all ends up in. On top of that sits the empty
app: the home screen a brand-new account sees, quick brewing without an
inventory, the cupboard, the shop scanner and the states every screen falls
back to. Coffee bag scanning is the first thing here that asks a model
anything: a photographed label is read into fields, the shop verdict is
written as an argument rather than picked from three sentences, and the coffee
itself is estimated onto the same five axes the drinker is described on - by
arithmetic on the phone first, and only then by a model reading what the tables
cannot. The calibration
brew is still read by a Slovak lexicon, and the three arithmetic rules survive
as the scanner's offline fallback.

And at the centre of it, the loop the whole product exists for: the screen
before the brew, the recipe engine that answers it, hands-free brew mode, and
the conversation afterwards that is the main way Brewmate learns anything. None
of it is wired to one method - everything works for every row in
`brew_methods`, and an espresso differs from a V60 only in what the model is
asked for and what the screen prints.

Two things now hang off that loop. A recipe somebody found elsewhere can be
converted onto their own equipment - deterministically, in an isolated module
with its own unit tests, with a model used only to read the source and to
explain the result. And a new bag on an espresso machine gets its own mode: one
change per shot, a timeline of the run, and a pinned recipe at the end.

On top of all of it sits what the loop leaves behind. Every recipe line has a
timeline - the versions, the cups and what was said about each - and a stretch
of brewing adds up to counts the app is allowed to draw one careful conclusion
from, offered and never applied. The model calls are routed by what they are
for, priced per model, capped per account per day and per month, and shown back
as a dashboard - and a spent allowance takes away nothing that does not need a
model. And the parts a product needs before it ships: error reporting on both
sides, a funnel over the flows that matter, an account export beside the
deletion that was already there, and the build and store configuration to get
it onto a phone.

---

## 1. Repository layout

```
brewmate_v2/
├── frontend/          Expo + React Native + expo-router (app skeleton)
├── server/            Fastify + Drizzle + Firebase Admin API
├── shared/            @brewmate/shared - Zod schemas + inferred types
├── docs/              Release and store material (see section 12)
├── render.yaml        The API as one hosted Node service (see section 12)
├── eslint.config.mjs  One flat config for the whole workspace
├── tsconfig.base.json Strict compiler options + cross-package path aliases
├── pnpm-workspace.yaml
└── CLAUDE.md          You are here. These rules are binding.
```

`shared` is the single source of truth for the API contract. A request or
response shape is defined there once, and both sides import it. If the app and
the API disagree about a field, the fix belongs in `shared`, never in a local
copy of the type.

It also holds the pieces of arithmetic both ends have to agree on exactly:
`shared/src/brewing/ratioCalculator.ts`, `shared/src/conversion/` - the recipe
conversion - `shared/src/tasteProfiles/foldAxisObservations.ts`, which is how a
set of taps becomes a claim about somebody's taste, and
`shared/src/coffeeTaste/`, which is how a printed label becomes a claim about a
coffee. Each is
self-contained, depends on nothing but plain values and has its own unit tests
(`shared/tests/`), so a better algorithm can replace one without touching
anything else.

---

## 2. Commands

Run from the repository root.

| Command                               | What it does                                    |
| ------------------------------------- | ----------------------------------------------- |
| `pnpm install`                        | Install the whole workspace                     |
| `pnpm typecheck`                      | `tsc --noEmit` in every package                 |
| `pnpm lint`                           | ESLint across the workspace (the project rules) |
| `pnpm format` / `pnpm format:check`   | Prettier                                        |
| `pnpm verify`                         | typecheck + lint + format check                 |
| `pnpm test`                           | Tests in every package                          |
| `pnpm --filter @brewmate/shared test` | Conversion unit tests (no database needed)      |
| `pnpm build`                          | Build every package                             |
| `pnpm dev:server`                     | API in watch mode                               |
| `pnpm dev:frontend`                   | Expo dev server                                 |

Server-only:

| Command                                      | What it does                                  |
| -------------------------------------------- | --------------------------------------------- |
| `pnpm --filter @brewmate/server db:generate` | Generate a migration from the Drizzle schema  |
| `pnpm --filter @brewmate/server db:migrate`  | Apply pending migrations                      |
| `pnpm --filter @brewmate/server db:seed`     | Fill the two catalogues (idempotent)          |
| `pnpm --filter @brewmate/server db:studio`   | Drizzle Studio                                |
| `pnpm --filter @brewmate/server test`        | Integration tests (needs `TEST_DATABASE_URL`) |

---

## 3. BINDING PROJECT RULES

These apply to **every** change in this repository, in every future prompt.
They are enforced by ESLint as errors and they fail CI. Do not weaken a rule to
make code pass; change the code.

### Rule 1 - Zero tolerance for hardcoded values

No literal may appear in a component or in business logic except `0`, `1`,
`-1` and the empty string. Specifically forbidden:

- colours (`#6B4226`, `'white'`, `'rgba(...)'`)
- dimensions, padding, margin, radius, font size
- any user-visible text
- API paths and URLs
- time constants, limits, thresholds
- storage keys, query keys
- magic numbers of any kind (for example 21 days of resting time)

Everything goes through a named constant or a design token.

**Where values are allowed to be written down:**

| Kind of value                                        | Home                                               |
| ---------------------------------------------------- | -------------------------------------------------- |
| Colours, spacing, radii, typography                  | `frontend/src/theme/tokens/`                       |
| User-visible text                                    | `frontend/src/i18n/translations/`                  |
| API paths, header names, auth scheme                 | `shared/src/api/`                                  |
| Error codes and the error envelope                   | `shared/src/errors/`                               |
| Field limits shared by app and API                   | `shared/src/users/userFieldLimits.ts` and siblings |
| Firebase and OAuth error codes                       | the `constants/` folder of the owning package      |
| HTTP status codes, methods, server/database defaults | `server/src/constants/`                            |
| Log messages                                         | `server/src/logging/logMessages.ts`                |
| Client-facing error messages                         | `server/src/errors/errorMessages.ts`               |
| Anything read from the environment                   | `server/src/config/`, `frontend/src/config/`       |

### Rule 2 - Everything in folders, one file = one thing

No `utils.ts` holding everything. Every component, hook, service, type and
constant gets its own file, in a folder named after its domain, with an
`index.ts` re-export.

The one deliberate exception: a Zod schema and the type inferred from it
(`export type X = z.infer<typeof xSchema>`) live in the same file. The schema
_is_ the type; splitting them creates two things that can drift apart.

### Rule 3 - Strict TypeScript

No `any`. No `as` type assertion without a reason. `as const` is fine.
If an assertion is genuinely unavoidable, it needs an `eslint-disable-next-line`
with a comment explaining why it is safe.

### Rule 4 - Components stay under 150 lines

Longer than that means it is doing more than one thing. Split it.

### Rule 5 - No business logic in components or route handlers

Route handlers resolve the caller and delegate. Components render. Logic lives
in services (`server/src/modules/<domain>/<domain>Service.ts`).

### Rule 6 - API keys never in the frontend

Only `EXPO_PUBLIC_*` variables reach the bundle, and everything in the bundle is
readable by anyone who installs the app. Firebase _Admin_ credentials, database
URLs and any secret live in `server/.env` and nowhere else.

### Rule 7 - No inline styles in JSX

Styles go into a `StyleSheet.create` call in a sibling `<component>Styles.ts`
file, built exclusively from design tokens.

---

## 4. How the rules are enforced

`eslint.config.mjs` is the whole policy. Every rule below is `error`.

| Rule                                                                                            | Enforces                                |
| ----------------------------------------------------------------------------------------------- | --------------------------------------- |
| `@typescript-eslint/no-magic-numbers` (allows `0`, `1`, `-1`, including inside object literals) | Rule 1                                  |
| `no-restricted-syntax` - hex colour ban outside `frontend/src/theme/tokens/**`                  | Rule 1                                  |
| `no-restricted-syntax` - absolute URL ban (`http`, `ws`, `postgres`)                            | Rule 1                                  |
| `no-restricted-syntax` - `as` assertion ban (`as const` allowed)                                | Rule 3                                  |
| `react-native/no-color-literals`                                                                | Rule 1                                  |
| `react-native/no-inline-styles`                                                                 | Rule 7                                  |
| `react-native/no-raw-text`                                                                      | text outside `<Text>`                   |
| `react/jsx-no-literals`                                                                         | every string in JSX must come from i18n |
| `react-native/no-unused-styles`                                                                 | dead style objects                      |
| `@typescript-eslint/no-explicit-any`                                                            | Rule 3                                  |
| `@typescript-eslint/explicit-function-return-type`                                              | explicit contracts                      |
| `max-lines`, `max-lines-per-function` (150) on the frontend                                     | Rule 4                                  |
| `typescript-eslint` strict + stylistic **type-checked** presets                                 | Rule 3                                  |

Exemptions, and only these:

- `frontend/src/theme/tokens/**` - the only place a hex colour may exist.
- `**/constants/**` and the token folder - the only places a number may sit
  inside an object literal.
- `server/src/db/seed/seedData/**` - reference data, which is nothing but
  numbers written down once: ratio windows, collar ranges, micron curves.
  Naming each of them would produce a constants file that is a worse copy of
  the same list.
- `*.config.ts` / `*.config.js` / `eslint.config.mjs` - tooling, not application
  code; `no-magic-numbers` is off there.

Adding a new exemption is a change to this document, not a quiet edit to the
lint config.

---

## 5. App architecture

```
frontend/
├── app.json            Expo config: permissions, privacy manifest, icons, splash
├── assets/             Icon, adaptive icon, splash mark, favicon
└── src/
    ├── app/            expo-router routes - thin files that delegate to a feature
    ├── theme/          Tokens, composed theme, ThemeProvider, useTheme
    ├── constants/      config, routes, navigation, queryKeys, storageKeys, limits,
    │                   brewing, http, time, interpolation
    ├── i18n/           Slovak copy, split by domain under translations/sk/
    ├── components/
    │   ├── ui/         Button, Card, Tile, SectionHeading, Text, Input, Chip,
    │   │               OptionCard, Sheet, ListItem, ChatBubble, Slider,
    │   │               NumberStepper, ProgressBar, EmptyState, LoadingState,
    │   │               ErrorState, QueryState, ValueDisplay - each its own folder
    │   └── layout/     Screen, TileRow, AppProviders, RootStack, TabsNavigator,
    │                   TabBarIcon, BottomNavBar
    ├── features/       one domain = one folder (auth, home, inventory, brewing,
    │                   chat, tasteProfile, coffeeTaste, bagEvaluations,
    │                   recipeImport, espresso, history, onboarding, profile,
    │                   designSystem);
    │                   each has services/ for the API calls and hooks/ for the
    │                   queries and mutations over them. `brewing` owns the
    │                   pre-brew screen, the recipe engine client and brew mode;
    │                   `chat` owns the conversation after the cup;
    │                   `recipeImport` converts a recipe found elsewhere;
    │                   `espresso` owns the dial-in mode; `history` owns the
    │                   timeline and the insights; `profile` owns the cost
    │                   dashboard and the data export
    ├── hooks/          only genuinely global hooks, incl. useEntityMutation,
    │                   useDebouncedValue and useAnalyticsFlush
    ├── lib/            apiClient, firebase, queryClient, queryCache, formatters,
    │                   fingerprint, requestErrors, text, analytics,
    │                   errorTracking
    ├── stores/         Zustand - UI state only
    └── types/
```

### Where things live, and why

- **Design tokens stay in `src/theme/tokens/`.** That path is the single lint
  exemption for colour literals (section 4). The composed theme, the provider
  and the hooks sit one level up in `src/theme/`, where a hex colour is still
  an error.
- **Routes live in `src/app/`**, not `frontend/app/`, so everything the app is
  made of stays under `src/`. A route file renders one screen component and
  nothing else - no logic, no layout.
- **Slovak copy is split by domain** under `src/i18n/translations/sk/`
  (`common`, `auth`, `navigation`, `screens`, `home`, `homeTiles`, `inventory`,
  `grinders`,
  `onboarding`, `tasteQuestionsLevels`, `tasteQuestionsDirect`,
  `tasteQuestionsIndirect`, `tasteQuestionsBeginner`, `tasteQuestionsExpert`,
  `equipmentSetup`, `waterAndSets`, `calibration`, `brewing`, `preBrew`,
  `brewMode`, `recipeChat`, `recipeImport`, `dialIn`, `scanner`,
  `tasteProfile`, `tasteAxisBands`, `coffeeTaste`, `profileSections`,
  `history`, `aiCosts`,
  `cupboardAndBrew`, `errors`, `designSystem`) and merged in
  `sk/index.ts`. One file would break the 150-line limit.
  `SK_TRANSLATIONS` is the source of truth for the key list: every future locale
  is typed against it, so a missing translation is a type error.
- **A sentence with a hole in it stays one string.** `t(key, values)` fills
  `{name}` placeholders through `lib/text/interpolate`, because Slovak puts a
  number in a different place from English and a different place again from its
  own plural - a sentence assembled from fragments at a call site is one no
  translator ever saw. A name with no value is left visible rather than closed
  up silently: a stray `{count}` is a bug somebody reports.

### Theming

Colours depend on the active scheme, so a stylesheet cannot be a module-level
constant. Every component ships a `create<Component>Styles(theme)` factory in
its `<Component>.styles.ts`, and the component calls
`useThemedStyles(createXStyles)`, which memoises the result per theme. The rule
is unchanged - styles are built from tokens, in a sibling file, never inline.

Geometry that only exists at runtime (a slider fill width, an animated
transform) is built by a small named function exported from the same styles
file, so it is still not written inside the JSX.

### Shape language

A deliberate deviation from Material Design 3: MD3 gives buttons and chips a
pill shape; Brewmate does not. `RADIUS` is the raw scale
(`xs 4, sm 8, md 12, lg 16, xl 24, full`) and `SHAPE` maps each kind of element
onto one of them (`SHAPE.button = md`, `SHAPE.card = lg`, `SHAPE.sheet = xl`,
`SHAPE.avatar = full`). Components read `SHAPE`, never `RADIUS`, so the same
kind of element has the same radius everywhere.

### Getting out of a screen

- **`Screen` draws the bottom bar, and nobody asks it to.** Half this
  application is pushed on top of the tabs - the scanner, the conversation after
  a cup, a coffee's own screen, the timeline, what the model calls have cost -
  and on every one of them the bar simply vanished: the way back was a gesture
  or a header arrow, and getting from a scan to the cupboard meant retracing the
  path that led there. "Every screen except these" is a rule about the
  application rather than a decision each screen makes, so it lives in
  `useShowsBottomNav` and is read off the route. A prop would be forgotten on
  the next screen somebody adds, and forgotten is the state this exists to fix.
- **Five segments do not get it**, listed once in `BOTTOM_BAR_HIDDEN_SEGMENTS`.
  `(tabs)` already has one, drawn by the navigator. `(auth)`, `onboarding` and
  `verify-email` are linear: there is nowhere else to be yet, and four
  destinations under a sign-in form are four ways to abandon it. `brew-mode` is
  the deliberate one - it is used at arm's length with wet hands over a running
  timer, and a row of destinations along the bottom edge is exactly where a
  thumb lands when the phone is picked up mid-pour.
- **Nothing on it is highlighted.** A screen pushed on top of the tabs belongs
  to none of them, and lighting up "Skrinka" while somebody reads their brewing
  history would be the bar saying where they are and being wrong. It is a way
  out, not a claim: the same four places, in the same order, in the same spot.
- **It is built from the tab bar's own tokens** - surface, hairline,
  `TAB_ICONS`, `TAB_LABEL_KEYS`, `TAB_ORDER` - because a bar that differed by a
  shade or a border would read as a different object appearing halfway through a
  flow. Where it appears it takes the bottom safe-area inset for itself; a
  screen that claimed it too would leave a strip of background under the bar.

### Data

- **TanStack Query** owns server state, persisted to AsyncStorage through
  `PersistQueryClientProvider`. Keys come from `constants/queryKeys.ts`, the
  storage key from `constants/storageKeys.ts`, every duration from
  `constants/limits.ts`.
- **Zustand** owns UI state only - at present the theme preference and nothing
  else. Server data never enters the store, and neither does onboarding
  progress: that belongs to the account rather than to the device, so it lives
  in `users.onboarding_state` and is read through `/me`.
- `lib/apiClient` is the only thing that talks to the API. Paths come from
  `@brewmate/shared` and every response is validated against the shared schema -
  a body that violates the contract throws, it does not resolve.
- `lib/apiClient` takes an `AuthTokenProvider` and runs with the Firebase one:
  every request carries `Authorization: Bearer <id token>`, and a 401 is retried
  exactly once with a force-refreshed token before it reaches the caller.

**Optimistic updates, and where they stop.** Two hooks in
`hooks/useEntityMutation/` divide every write in the app:

- `useOptimisticEntityMutation` is for changes whose outcome is not in doubt -
  pinning a recipe, archiving a bag, weighing out a dose, renaming a set,
  marking a bag as bought. The patch goes into every cached page and the detail
  entry, the previous contents are kept, a failure puts them back, and the
  domain is refetched afterwards so the guess never outlives the answer.
- `useInvalidatingMutation` is for everything the server decides: logging a brew
  (the bag comes from the recipe and the learning weight is priced from the
  declared constraints), adding a taste event (which re-folds the whole
  profile), contributing a grinder (which may already exist), deleting a recipe
  (which is refused once it has been brewed).

The line is deliberate. Guessing at a value the API is about to compute means
showing the user a number that is about to change underneath them, and the
numbers in question are exactly the ones this product exists to get right.

### The empty app

The state most users see first, and the one a product is judged on. Nothing
here is allowed to be a blank screen with the words "žiadne dáta".

- **The home screen is a grid of tiles, and a tile is only drawn once it has
  something to say.** A dashboard with no data is a set of empty frames, and
  that is the state this product would be judged on. So the reporting row -
  the cupboard and the week of brewing - is simply absent until there is a bag
  or a cup behind it, and what a brand-new account gets instead is four things
  to do: the three "Začni tu" steps, the scanner, quick brewing and the
  brewing screen. Tiles rather than cards because these are destinations; a
  card invites reading, and nothing on this screen is worth reading for its own
  sake.
- **`Tile` is a card that has been given a shape.** Same radius, same padding,
  a floor under its height and a share of the row it sits in - both as flex
  weights, so a tile is correct on its first frame without waiting to be told
  how wide the phone is. Three tones and no more: `primary` for the one thing
  the screen most wants pressed, `accent` for the second, `neutral` for
  everything that reports rather than invites. A screen where every tile is
  coloured is a screen with no hierarchy at all.
- **The decoration is drawn, never illustrated.** Two rings clipped by the
  corner they are pushed out of, built from the same radius and border tokens
  as everything else. An illustration has a fixed palette and a fixed density
  and would be wrong in one of the two colour schemes the day it was added; a
  shape made of tokens is right in both, at any size, forever.
- **One hint, chosen from the account.** Not a list: five pieces of advice at
  once is five nobody reads. `resolveHomeHint` walks an order that is the whole
  point - a profile nobody has filled in, then an empty cupboard, then a bag
  going off on somebody's shelf, then a fortnight without a cup - and only when
  there is genuinely nothing to report does it teach one thing instead, picked
  by the calendar day so it is the same all day and different tomorrow. A card
  that went blank on a well-kept account would punish exactly the people using
  the app properly.
- **A tile reports what it can prove.** The cupboard sums the same page the
  cupboard screen itself reads, so the two cannot disagree; an unweighed
  cupboard says "nezvážené" rather than printing a confident nought; and the
  brewing tile counts a week rather than a lifetime, because one page of logs
  cannot say how many cups an account has ever made and the profile's own brew
  count means something else again - it counts the cups that were described.
  A number on a tile that needs a paragraph beside it is a number that will be
  misread.
- **The taste tile draws nothing until there is something behind it.** A
  profile built from no evidence is five middles, and five middles drawn neatly
  stop looking like an absence of evidence and start looking like a considered
  opinion. Two conditions have to hold, because they can disagree: an account
  can carry a real confidence built entirely from a roast preference and a milk
  habit while having said nothing about any axis. Until then the tile says so
  and leads to the questionnaire. Afterwards it is literally the same component
  as the labelled chart, without its labels - one picture, not a second opinion
  drawn differently, and not a miniature that will eventually differ from it by
  a ring or a stroke.
- **The ticks are read from the account, not from a checklist beside it.**
  `useGettingStarted` asks the profile, the cupboard, the shop verdicts and the
  brew logs, one row each. Somebody who answered the questionnaire from the
  profile screen, or added a bag in a shop, has done that step whatever route
  they took to it - a tick that can disagree with the data is worse than no
  tick.
- **The card leaves twice over:** on its own once all three are done, and by
  hand at any point. The dismissal is the one piece of this that lives in
  `uiStore` rather than on the account, because it is a preference about this
  screen on this phone, like the theme beside it - not progress.
- **The shop scanner is the one tile painted in the primary tone**, and it
  spans the grid rather than sharing a row. It is the only feature a brand-new
  account can use in the first minute and get something real back from: it
  needs no cupboard and no history, only the questionnaire. Burying it three
  taps inside the inventory would be hiding the one door that is already open.
- **Quick brewing does not need an inventory.** `/quick-brew` asks for the
  method, then for whatever the drinker happens to know about the beans - a
  roast level, a name, or nothing at all - and answers with a recipe whose
  `bagId` is null. The cupboard is offered _after_ the cup, not as a gate in
  front of it. Nobody wants to fill in a database before they are allowed to
  make coffee.
- **The empty cupboard offers three ways out**, in the order they suit the
  person reading them: scan a bag, type one in, or - quieter, for somebody with
  nothing at home - go and be advised in a shop.
- **The empty brewing history describes itself**, and is the one card left on a
  screen otherwise made of tiles - deliberately, because it is the only thing
  there to be read rather than tapped. Three lines of what will appear after
  the first brew, and one sentence about why the trouble is worth taking.
  "Opíš mi kávu" is a favour the user does the app, and a favour deserves a
  reason. Once there is a cup behind it the card leaves for good: the tiles
  above report the history from then on.

### Reading a coffee bag

The first thing in Brewmate that asks a model anything, and the reason
`POST /ai/parse-coffee-bag` exists.

- **Every model call goes through the server.** Everything in an Expo bundle is
  readable by anybody who installs the app, so `ANTHROPIC_API_KEY` lives in
  `server/.env` and nowhere else. The app uploads the photograph and sends a
  URL; the bytes never travel through the Brewmate API, which keeps a request
  small enough to survive a shop's signal and makes a retry cost one short call
  rather than a second upload.
- **Every field carries its own confidence, and anything unreadable is null.**
  Those two rules are the same rule. An invented roast date becomes a resting
  window, which becomes a recommendation, which becomes a bad cup nobody can
  trace back to a guess made in a shop. What was read badly is marked in the
  form rather than corrected - the app does not know better than the person
  holding the bag, it only knows which boxes it squinted at.
- **The answer is validated against the shared schema and retried exactly
  once**, with the validation error handed back. Once, because the second
  attempt is what tells a model that slipped apart from a photograph nothing
  can be read from; a third only spends somebody's afternoon proving the same
  thing. Both attempts are billed into `ai_usage_logs` - a usage log that hides
  a retry is one that disagrees with the invoice.
- **Readings are cached under two keys, in `coffee_bag_parses`.** The
  photograph's own hash catches the cheap repeat; the normalised
  `(roaster, name)` pair catches the same coffee shot by somebody else in
  another shop, which is what makes the second scan of a popular bag free for
  everybody. The table has no `user_id` and survives an account deletion, like
  the grinder catalogue: what is stored is a printed label - public information
  about a product on a shelf - and nothing about who photographed it.
- **A known coffee answers with the stored reading rather than this
  photograph's.** Shop lighting against daylight is the same coffee described
  twice, and the entry that has been standing long enough for somebody to have
  corrected it is the better of the two.
- **Reading the bytes is the server's job, not the provider's.** The hash that
  makes a repeated scan free can only be taken from the bytes, and a storage
  URL that needs credentials is then this server's problem rather than a silent
  failure somewhere else. The URL comes from a client, so the size, the format
  and the time it may take are limits rather than expectations.
- **An optical reader looks at the photograph first, and it is allowed to be
  missing.** `LabelTextReader` is a port like every other third party here, with
  a Google Vision implementation behind `GOOGLE_VISION_API_KEY` and
  `GOOGLE_VISION_ENDPOINT`. It does two things and they are the same thing: it
  transcribes the label, which is what makes a roast date stamped in grey on a
  seam legible at all, and it says whether the picture was worth reading. A
  reader that is absent, or configured and unreachable, is not a failure - the
  photograph goes to the model unaccompanied, exactly as it did before there was
  one. Making a scan in a shop depend on a second provider's afternoon would be
  a feature that is less reliable for having been improved.
- **The transcript is evidence about the small print, never the source.** The
  prompt says so, and says the photograph wins on a disagreement: an OCR engine
  misreads a `5` as an `S` with total confidence, and a model told to trust the
  transcript would copy that into a field it can see perfectly well. A word that
  appears only in the transcript was not printed on the bag.
- **A photograph nothing came off is refused before a token is spent.** Two
  reasons refuse it and only two: nothing legible was found, or what was found
  the reader could barely make out - a transcript of guesses being worse than
  none. Darkness and glare never refuse anything on their own; a dim picture
  that read perfectly is a good picture. They ride along with a refusal as its
  explanation, because the only thing anybody can do with one is take another
  photograph, and "nič som neprečítal, bolo priveľmi tma" is an instruction
  where "nič som neprečítal" is a dead end. `photoIssues` therefore has three
  states - nobody looked, looked and had no complaint, refused and here is why -
  and a refused photograph is not cached: those bytes were never read.
- **The app stays on the camera when a photograph is refused.** `refused` is its
  own capture outcome for exactly that reason. The reasons are printed above the
  button that is about to be pressed again, the tile relabels itself "Odfotiť
  znova", and typing the label in by hand is still there underneath - a refusal
  with no way past it would be a dead end on the one screen that gets used
  inside a building on one bar.
- **Vision calls are not in `ai_usage_logs` and not behind the allowance.** That
  ledger prices model tokens and an annotation has none. They are bounded by
  shape instead: one per scan, only after the image hash misses, and never for a
  photograph that has been read before.

### What is in the bag

The counterpart to the taste profile, and the reason that profile is measured
the way it is. `POST /ai/estimate-coffee-taste` answers what a coffee tastes
like - on the same five axes, with the same per-axis confidence, folded by the
same arithmetic - so that the coffee and the person can eventually be held up
against each other without either being translated first.

- **The estimate is arithmetic over signals, and the signals are the whole
  argument.** `shared/src/coffeeTaste/` reads a label into weighted
  observations: the roast level, the process, the origin, the altitude, the
  variety and every printed note the lexicon recognises. Each one states where
  a coffee like this sits, and `foldAxisObservations` - the same function the
  questionnaire uses - weighs them against each other. The tables live in
  `constants/` with the reason for each weight written next to it, because
  those weights are the entire claim this feature makes.
- **The roast outweighs the origin, and the process is close behind.** A dark
  Ethiopian and a light Ethiopian are further apart than a light Ethiopian and
  a light Kenyan, so an ordering that put the country first would get the
  common case wrong. Printed notes sit just under the roast: the roaster tasted
  this lot, which is more specific than any generalisation about a country -
  and they are also marketing, which is why they are not first.
- **It runs on the phone, before any request is made.** The estimate is on
  screen instantly, offline, with no allowance spent, and it updates as
  somebody types a coffee into the form by hand. That is the feature rather
  than a fallback: this is used standing in a shop on one bar of signal, and a
  screen that waited for a server to say that a dark roast is bitter would be
  worse in every case.
- **A bag that says almost nothing still gets an answer.** One country is
  enough for a shape, and it comes back at about a quarter confidence. What it
  must never do is answer with five middles stated firmly - an axis nothing
  spoke about is left at neutral carrying no confidence at all, which is what
  the chart then draws as an outline rather than as an opinion.
- **The model contributes evidence, never an answer, and the schema is what
  enforces it.** There is no field anywhere in `coffeeTasteReadingSchema` for a
  finished estimate. What comes back is observations plus how much the label
  supported them, and `toModelSignal` turns that into one more weighted signal
  that has to survive the same fold. Asked outright what a coffee tastes like,
  a model will describe a bag it has never met with total confidence, and
  nobody - including the model - could then say which part came from the label
  and which from a roaster's marketing copy it once read.
- **Where the model and the label disagree, the confidence falls.** It cannot
  turn a dark roast into a bright coffee; it can only make the app less sure,
  which is the correct outcome, because a label and a model that contradict
  each other genuinely do not know what is in the bag. What the model is
  actually for is the part no table can do: a note nobody wrote a rule for,
  what Yirgacheffe or Nyeri implies, a label in a language the lexicon does not
  cover.
- **A reading is cached per coffee, not per person**, in `coffee_taste_readings`
  - user-less like `coffee_bag_parses`, and for the same reason: the same bag
    tastes the same for everybody, so the second person to scan a popular one
    gets the reading free. Only the model's reading is stored, never the finished
    estimate, so correcting a roast level on the form changes the answer
    immediately instead of leaving a stale row behind.
- **The summary is the one part a model writes.** Five numbers are a shape;
  "bude to plná, čokoládová káva s nízkou kyslosťou" is what somebody standing
  in a shop actually wanted to know. It is absent rather than faked wherever no
  model was reached, and the card simply prints one fewer line.
- **The card says what the estimate rests on.** An estimate from a country
  alone and one from a full label are five numbers either way, and the
  difference between them is the difference between a guess and a reading.
  Naming the evidence is what lets somebody disagree with the answer rather
  than only believe or disbelieve it.
- **It is drawn as the same web as the taste profile**, deliberately the same
  component rather than a chart of its own. The entire point of describing a
  coffee on these axes is that it can be compared with a person, and two
  pictures drawn differently would leave that comparison to the reader.

### The shop verdict

"Mám si ju kúpiť?", asked in front of a shelf and answered on the phone.

- **The verdict is written, not chosen.** `POST /ai/evaluate-coffee` produces
  two to four Slovak sentences, a list of reasons and a list of gaps. The rules
  it is held to are in `coffeeVerdictPrompt.ts`, and each of them says why it
  exists, because a model told why a rule exists keeps it in the cases the rule
  did not anticipate.
- **Nothing may be scored.** No percentages, no stars, no grade, no bare yes or
  no. A number in front of a shelf reads as a measurement of somebody's taste,
  and nobody has measured that. The phrasing is always probabilistic - "táto ti
  pravdepodobne bude chutiť, pretože..." - and marketing language is banned
  outright: the screen describes the coffee and the person, never the purchase.
- **Every reason names both sides.** "Praženie je svetlé a ty máš radšej
  tmavšie" is a reason; "svetlé praženie" is not. Reasons against the coffee
  are as welcome as reasons for it, because a verdict that only ever agrees is
  one nobody will believe twice.
- **Nothing about the person travels in the request.** The profile, its
  confidence, the brew count and the history are read off the caller's own rows.
  A profile a client could declare would be a profile anybody could declare,
  and the one thing that makes this verdict worth reading is that it is about
  this person.
- **A low confidence has to be admitted in the text itself.** The bands live in
  `@brewmate/shared` precisely so the sentence the server writes and the notice
  the app prints beside it cannot contradict each other. At `none` the verdict
  gives no taste argument at all and says so - this is the first screen a new
  account reaches, and repaying that with an invented opinion is the one thing
  it must not do.
- **A coffee already judged is answered from that verdict.** A shelf is exactly
  where somebody picks up the same bag a second time, and advice that comes out
  differently every time it is asked for is advice nobody can rely on. The card
  prints the afternoon it was given - `writtenAt`, formatted in the reader's own
  timezone, because "hovorím ti to isté, čo vtedy" is unverifiable by the one
  person who could check it unless it says when "vtedy" was. `/scan` lists
  everything ever judged, each entry carrying what happened afterwards as its
  own labelled line: whether the bag was bought is the only thing this app ever
  learns about whether it was any good at this.
- **The card names the coffee it is an opinion about.** Obvious in the second
  after a scan and useless the moment somebody has put that bag down and picked
  up another, or come back to the screen a minute later. An opinion whose
  subject is not written on it is one that gets attached to the wrong coffee.
- **The sentence is set at the size of an answer**, not as body text under a
  label - this is the screen the whole feature exists for. What is emphasised
  is the sentence and never a verdict level: the card carries no colour that
  would grade the coffee, because a grade in front of a shelf reads as a
  measurement of somebody's taste and nobody has measured that.
- **A reason is marked with a bullet, never a tick.** Half of them argue
  against the coffee - "praženie je iné, než aké ti zvykne sadnúť" is a reason,
  and as welcome as one for it - and a green check beside that sentence would
  turn the argument into an endorsement of itself.
- **The three offline rules survive as the fallback.** No signal, no provider,
  a model that will not answer - the roast against what this person reaches for,
  the printed notes against what they like, and the roast date against the
  calendar still produce an answer, and the card says plainly that a phone wrote
  it. This screen exists to be used inside a building on one bar, and an app
  that answers "skús to znova" there has answered nothing.
- **The reasoning and the gaps are stored separately**, as the API already
  models them, and both are printed - folded away behind one tap, because in a
  shop the sentence is wanted first and the argument is what somebody opens when
  they want to disagree with it. `profileConfidenceAtTime` is stamped by the
  server, so how much that afternoon's advice was worth stays readable a month
  later.

### Two modes, one parsing layer

`/scan` is both the shop scanner and the way a bag gets into the cupboard.

- **The mode is asked, not guessed.** A bag in a shop is a question; a bag in a
  carrier bag is a row in the cupboard. Guessing wrong would put a verdict in
  front of somebody who already owns the coffee. The cupboard's own buttons
  skip the question with `?mode=inventory`, because it already knows.
- **The photograph is an offer, not a gate.** "Zadám to ručne" is a tile the
  same size as the camera, beside it rather than under it, and every failure
  along the way - a refused permission, an upload that will not go, a label
  nothing could be read from - lands on the same form with whatever was read so
  far. Stacked as the third of three buttons it read as the thing you fall back
  to once the two above have failed you, which is the opposite of what it is.
  The library sits underneath and quieter: it is neither path, it is the same
  photograph taken earlier. A build with no storage bucket hides the camera
  rather than failing when it is pressed.
- **The flow says how far through it you are.** This is the one thing in the
  app somebody works through standing in a shop, one-handed, with a bag in the
  other, and "how much more of this is there" is a fair question there. The
  count cannot be a constant: a scan opened from the cupboard skips the first
  question and a bag being written down never reaches a verdict, so
  `resolveScanSteps` builds the list for the scan actually happening. The final
  screen is outside the count - it is what happened, not a step to get
  through.
- **The upload is retried with a widening wait.** The failure this is built for
  is a signal that comes and goes: inside a shop an upload fails, and a few
  seconds later it does not. Three attempts with doubling waits span several
  seconds of walking rather than three tries in one dead spot.
- **Buying a bag writes it into the cupboard.** Somebody who has just decided to
  buy a coffee should not then be asked to type its label a second time, and
  everything needed is already on the screen. The bag opens full: its remaining
  amount starts at the printed weight.

### The brewing loop

The core of the product, and the only part of it that has to be true of every
row in `brew_methods`. Nothing anywhere in this loop branches on "filter" or
"espresso" as a special case: a method carries its own ratio window and its own
category, and those two facts are the whole of what makes a shot different from
a pour-over.

**The first screen of a brew** (`/brew`, before anything else). Which coffee,
asked on its own screen, as two tiles: photograph the bag, or pick one out of
the cupboard.

- **It is a screen rather than the first card on the form.** Everything below it
  is written around the answer - the dose window, whether the bag is even ready,
  the roast the recipe assumes - and asked as the first of six cards it was
  scrolled past. It is also the only question here that can be answered before
  anything else is known.
- **The two tiles are the same size, side by side.** Photographing a bag is not
  the fallback for an empty cupboard and the cupboard is not the fallback for a
  bad camera; they are two ordinary situations, and whichever one somebody is
  in, the other being louder is the screen guessing wrong about them. As a list
  with the cupboard on top, a coffee that had not been written down read as an
  omission to fix before anybody was allowed to make coffee.
- **A photographed bag lands in the cupboard on the way through.** Not
  bookkeeping: the engine can be handed a bag or a sentence of free text, and
  the free-text path loses exactly the two facts that move a recipe most - the
  roast level and the roast date. Somebody photographing a bag at a counter owns
  that coffee and is about to brew it, so the reading is kept rather than thrown
  away and retyped as prose. The label is shown back first - "rozumiem tomu
  takto", the same offer the calibration brew and the import both make.
- **"Nemám ju zapísanú" is still a first-class answer**, quieter and underneath,
  and it still gets a recipe. Nobody has to fill in a database before they are
  allowed to make coffee.
- **A build with no storage bucket hides the camera tile** rather than failing
  when it is pressed, as everywhere else.
- **The brewing form then reports the coffee rather than offering it again.**
  The bag list used to live in both places, and two places that set one value
  are two places that eventually disagree about it. The card says what was
  answered and sends anybody who wants to change it back to the question - which
  keeps every other answer on the screen, because picking up a different bag is
  not a reason to set the brewer again.

**The rest of the screen before the recipe** (`/brew`, the brewing tab). Deciding
what is being brewed _is_ brewing, so this is the tab itself rather than a menu
leading to one.

- **The questions are cards with a glyph, not rows of chips.** Choosing a
  coffee turns on two facts a chip has no room for - how much is left and
  whether the bag is ready - so a row of names alone made the bag that had been
  resting three days look exactly like the one at its peak. Choosing a brewer
  is the most visual decision in the app: a V60 and a moka pot are different
  objects, not different words, and the family printed under each name is what
  tells somebody who has never met "Origami" what kind of coffee it makes.
- **The glyph comes from the method's category, never from its key.** Nothing
  in this application branches on `key` - adding V60 Switch is an insert, not a
  release - and an icon table keyed by `key` would quietly break that by giving
  the next seeded method a blank square where every other one has a picture.
- **The plan card is what turns five answers back into one decision.**
  Everything on it was chosen further up the screen, in cards somebody has
  already scrolled past; by the time they reached the button the dose was four
  screens away and the only way to check what they were about to spend a model
  call on was to scroll back through all of it. It reports and never edits -
  two places to set a dose would eventually disagree about what the dose is.
- **The set is answered in one tap, and it narrows everything below it.**
  Switching to "Chata" is not a label change: the dripper is at home, so the
  methods it makes possible are not offered, and what that place is usually
  missing is pre-ticked. `useAvailableBrewMethods` takes the set for exactly
  this reason. Without a set the answer is everything still owned - somebody
  who has never made one has not thereby lost their kettle.
- **"Dnes nemám všetko" is folded away, and counts what is behind it.** Most
  mornings nothing is missing and nine unticked boxes above the thing somebody
  came for is a section they scroll past. Collapsed, the header says how many
  are set: a folded control hiding state nobody can see is worse than no
  control.
- **Every constraint in the contract has a checkbox.** `BREW_CONSTRAINT_OPTIONS`
  is built from `BREW_CONSTRAINT_NAMES` rather than written out, because a set
  can carry any of them as its default and a flag with no box would be a state
  somebody cannot see and cannot turn off. The same list is what the set form
  offers, so the two cannot drift apart.
- **The calculator runs in three directions, and which one moves matters.**
  A dose moves the water. A water weight moves the ratio, because the two
  weights are what somebody actually has. A ratio moves whichever weight was
  _not_ touched last - somebody who has just weighed seventeen grams into the
  brewer and then reaches for a tighter ratio means "more water", not "go and
  weigh the coffee again". The arithmetic lives in `@brewmate/shared`, so the
  number on the screen and the number in the database are rounded by one piece
  of code.
- **Validation describes, it does not block.** The person holding the brewer
  knows things the app does not - that this V60 takes more than the box claims,
  that there is a second bag of the same coffee in the cupboard. Every warning
  names the figure it is complaining about, because "too much" with no number
  is a warning nobody can act on.
- **A bag nobody weighed cannot run out.** `remainingGrams` of null means
  unmeasured, not empty, and warning about it would teach people to ignore the
  line.

**The recipe engine** - `POST /ai/generate-recipe`.

- **The dose and the water cannot be overwritten, and the enforcement is the
  schema.** There is no field for either anywhere in the answer the model is
  allowed to give. A rule in a prompt is a request; a field that does not exist
  is a guarantee. A model that disagrees has to say so in the rationale, once,
  which is the honest version of the same disagreement.
- **The ratio is recomputed from the two weights** rather than copied out of
  the request. Grams are the physical fact and a ratio is arithmetic over them;
  a recipe card whose own numbers do not divide is one somebody catches with a
  scale.
- **The domain knowledge is a versioned document, not a string in a service.**
  `extractionKnowledge.ts` is the largest single input to every recipe the
  product gives and is sent unchanged on every brew, so it is written to be
  diffed and blamed. It is knowledge rather than rules: a model told _why_
  grind moves extraction can reason about a cup nobody anticipated, one told
  "if sour then two clicks finer" can only answer the cases somebody wrote down.
- **Every system prompt is cached.** The prompts here are long, unchanging and
  re-sent constantly, which is the shape caching exists for -
  `anthropicTextCompletionClient` marks the system block on every call. The
  three tiers of input token are then priced separately in `estimateAiCost`,
  because charging a cache read at the fresh rate would report roughly ten
  times what a call cost, and a cost estimate that disagrees with the invoice
  in either direction is worse than none.
- **The method's category picks the answer schema, not the model.**
  `resolveGeneratedRecipeSchema` hands over the one shape an answer may take,
  so an espresso answered with a bloom in it is a validation failure the single
  retry is told about, rather than a recipe reaching somebody standing at a
  machine that has no bloom to give.
- **Both shapes land in one `BrewParams`.** An espresso's yield is
  `waterGrams`, because that is literally what ends up on the scale; its target
  time is `totalTimeSeconds`; only pre-infusion has no counterpart and gets a
  field. A parallel set of espresso columns would mean every screen that reads
  a recipe had to ask which kind it was holding first.
- **Constraints change the shape of the recipe, and the hints are stored with
  it.** Without temperature control the recipe says how long to let the water
  stand rather than naming a number; without a scale it converts to spoons and
  says why that is less accurate; without a clock every time becomes something
  to watch for. Each hint is attached to its constraint _by name_, so the
  interface can print it beside the checkbox that caused it - and a hint is
  advice, never an apology. The prompt also says to name the advantages: a
  plastic dripper holds heat better than an unpreheated ceramic one, and
  somebody who is missing something should also be told what they are not
  missing.
- **The recipe is stored before the response leaves**, unsaved and unpinned.
  Everything downstream needs an id - brew mode logs against it, the
  conversation hangs off it, an adjustment becomes its child - and a proposal
  is not yet a favourite.

**Brew mode** (`/brew-mode`) - fullscreen, one finger, wet hands.

- **The countdown is computed from a timestamp, never accumulated by a tick.**
  This is the one thing on this screen that had to be got right. iOS suspends
  JavaScript timers the moment the app backgrounds or the display sleeps -
  which is exactly what happens when somebody puts the phone down to pour - and
  a counter adding a second per tick would come back having lost the pour. The
  interval only asks for a redraw; if it never fires, the next one still
  reports the true time, and an `AppState` listener redraws the instant the
  phone is picked back up.
- **Which step is current is derived, not counted.** `resolveStepIndex` catches
  up over however many steps passed while the app was away, in one move rather
  than one per tick. Skipping moves the clock's origin instead of a separate
  index, so there is only ever one answer to "where is this brew".
- **A step with no time is not missing data.** It is the instruction "wait
  until you see it" - the shape a brew declared without a clock takes - and the
  screen shows a button instead of a countdown to nothing. Nothing auto-advances
  past one.
- **Both cue channels fire, always.** A phone propped against a kettle
  transmits nothing to the hand holding it, and an extractor fan swallows a
  sound. The warning two seconds out is a lighter tap than the transition:
  something is about to happen and something is happening are different
  messages, and a phone that makes one noise for both gets ignored for both.
- **Methods with no pour schedule get the simplified variant** - a stopwatch
  against a target time, which is all an espresso, a French press or a cold
  brew needs. Past the target the countdown becomes a plain elapsed count: a
  press that stood a minute longer has not failed, and a negative number would
  say it had.
- **A brew that was made is never lost.** The log is written when the brew
  ends, not when somebody gets to the chat, and a request that fails goes to
  disk instead - the places brew mode is most used are the places with the
  least signal. `PendingBrewLogSync` sits at the root of the app, because the
  moment the queue can be emptied is the moment the connection returns and has
  nothing to do with which screen is open. A flush puts back everything it
  could not send, in order.
- **The screen stays awake and does not swipe away.** A stray edge swipe
  halfway through a pour would lose the timer the whole feature is built on.

**The conversation afterwards** - `POST /ai/recipe-chat`, and the main
mechanism by which this product learns anything.

- **It opens with a question, not a form.** Five sliders would be easier to
  build and nobody would fill them in twice; "aké to bolo?" gets answered
  because it is a question somebody can answer while holding a mug.
- **The suggestion has to be one this person can carry out, and the schema is
  what enforces it.** `resolveCoachAnswerSchema` builds the answer's shape from
  that brew's constraints: without a thermometer there is no temperature field
  to fill in, without an adjustable grinder no grind field, without a clock no
  times. An impossible suggestion is therefore a validation failure the single
  retry is told about, rather than a message telling somebody the app was not
  listening. When the missing thing really is the cause, the prompt says to
  admit it - and then still give the best available substitute, because an
  explanation with no suggestion after it is an excuse.
- **A patch is stored, never applied.** It rides on the message that argued for
  it, so a suggestion nobody took is still part of the record, and the recipe
  somebody brewed stays the recipe they brewed. Taking it creates a child with
  `parentRecipeId`, which is what lets the next answer read how the numbers got
  here rather than only where they ended up.
- **The diff shows only what moves.** Everything on the card is a change and
  anything absent did not move, which is the whole reason it is readable at a
  glance. A rewritten pour schedule is reported as rewritten rather than as two
  tables nobody compares.
- **A patch's ratio follows its grams.** Moving the water moves the ratio;
  moving the ratio alone moves the water, never the dose - the dose is what
  somebody weighed and probably already tipped in, and the water is still in
  the kettle. `applyRecipePatch` lives in `@brewmate/shared` so the numbers
  somebody agreed to and the numbers they got are produced by one function.
- **What the chat teaches the profile is weighed by what the brew was worth.**
  The event carries the brew log's own `profileLearningWeight` - priced from
  its constraints on the way in and never recomputed - so somebody complaining
  that a cup was flat when they had no way to weigh anything is recorded as
  describing their kitchen, not their taste. The prompt draws the same line:
  "bola príliš kyslá" is a preference, "bola slabá, lebo som nemal váhu" is
  not. An observation naming no axis at all is dropped rather than stored as an
  event the fold cannot use.
- **The event points at the message it came from**, so what Brewmate concluded
  can always be traced back to the sentence somebody actually wrote.
- **The quick chips are shortcuts to writing, not a menu of answers.** Each
  sends an ordinary first-person Slovak sentence and fills the box rather than
  firing on tap, so "menej kyslé" plus "a bola aj slabá" is still possible -
  and the conversation reads the same whether somebody tapped or typed.
- **The chat is reachable from any recipe, not only after a brew.** Somebody
  who worked out an hour later what was wrong with a cup should be able to say
  so.

### Somebody else's recipe

`/import-recipe`, and the one feature in this app where a model is deliberately
kept away from the numbers.

- **The conversion is arithmetic, in code, in its own module.**
  `shared/src/conversion/` converts a grind through both grinders' micron
  curves, scales the amounts to the target brewer at the source's own ratio,
  decides the temperature by whether one can be set at all, and scales the pour
  schedule with the water it pours. It has its own unit tests and depends on
  nothing but plain values, so the day a real particle-size model replaces it,
  the replacement is one folder and one test file.
- **A model reads the source and explains the result, and touches nothing
  between.** `POST /ai/parse-recipe` turns a pasted video description or a
  photographed screen into fields; `POST /ai/convert-recipe` runs the
  arithmetic and then asks for the grind in Slovak words and an explanation.
  The answer schema has no field for a dose, a water weight, a ratio, a grind
  setting or a temperature - the same guarantee the recipe engine gets, applied
  to a longer list. A model asked to convert 22 clicks on a Comandante into a
  setting on a JX-Pro will produce a confident number, and nobody - including
  the model - can say where it came from.
- **Every number says how much it is worth.** The report is `{field, precision,
reason}` in machine names: `exact` came across untouched or is arithmetic
  that cannot be wrong, `estimated` is a real calculation over approximate
  inputs, `unknown` means the original never said. The conversion writes no
  Slovak at all - the app translates the machine names - so the arithmetic and
  the sentences beside it cannot drift apart, and adding a step to the
  algorithm is a type error at the place that has to explain it.
- **A converted grind is never `exact`.** Burr alignment, bean density and how
  the last person left the collar move a real grind further than the difference
  between two published curves. It is a starting point, the card says so every
  time, and an estimated calibration or an unverified catalogue entry is named
  out loud rather than folded into a general hedge.
- **What was read is shown back before anything is computed.** "Rozumiem tomu
  takto", the same offer the calibration brew makes. A conversion multiplies its
  inputs into each other, so a dose misread at the top comes out as a grind
  setting at the bottom with nothing pointing at where it went wrong - and the
  one person who could catch it is holding the original.
- **A hole stays a hole.** Anything the source did not state is null through the
  reading and through the correction, and the fallback it triggers is reported
  as a fallback. The report keeps the source recipe whole, because "but what did
  the original actually say?" is the first question a disappointing cup raises.
- **The result is stored as `imported`**, with the report inside
  `params.conversion` rather than beside it in the response. A card reopened next
  month that has lost the sentence about the grind has turned an estimate into a
  measurement by doing nothing at all.

### Dialling in an espresso

`/dial-in` - the recipe chat, narrowed until it can only do one thing per turn.

- **One change per shot, and the schema is what enforces it.** The answer is a
  discriminated union over grind, dose or nothing, so an answer that moves both
  is a validation failure the single retry is told about rather than something
  the service refuses afterwards in a message that reads as the app not
  listening. Two variables moved together produce a shot that carries no
  information: it came out different, and nobody can say which change did it.
- **"Change nothing" is a real answer.** The shot was good, or the last change
  has not had a fair try. A dial-in that never ends is one somebody abandons
  halfway through a bag.
- **The shot is recorded before the model is asked anything.** It is an ordinary
  brew log, written through the same service and priced by the same rules, so a
  model call that fails leaves the run intact - and the run is the only thing
  the next answer reasons about.
- **The advice reads the run, not the last shot.** `resolveShotTimeline` derives
  what changed between each pair and whether the shot came closer to the target
  window, and the same derivation feeds both the chart and the prompt. A grind
  that has already gone finer twice without moving the time is exactly the case
  where the answer has to stop grinding, and a model shown one shot cannot see
  it.
- **The timeline is read back from the rows**, not accumulated on screen: the
  gaps between shots are spent grinding and tamping with the phone in a pocket.
- **A patch is stored, never applied**, as everywhere else in this app. Taking
  one creates a child recipe, so every shot still points at the numbers it was
  actually pulled with. The version that finally works is saved and pinned for
  the pair (bag, method), which is what the whole exercise was for.

### The history, and what it adds up to

Two screens over the same rows, answering two different questions: what
happened to this recipe, and what all of it says about the person brewing.

- **A timeline belongs to a pair, not to a coffee.** `/timeline` takes a method
  and a bag, and an absent bag is the quick-brew line rather than "any bag" -
  the same rule pinning already follows. Reached from a bag's own screen, under
  the versions rather than instead of them: the list answers "what have I got"
  and the timeline answers "how did it get here", and those are questions
  somebody asks on different days.
- **Oldest version first, because it is read as a story.** These were the
  numbers, this is what was said about the cup, this is what changed because of
  it. Each version carries its own cups and its own notes rather than a list
  beside them, because an answer to "what did changing that do?" needs the
  change and its consequences in the same place.
- **A cup brewed with something missing is marked, not hidden.** The badges come
  from `readActiveConstraints` in `@brewmate/shared` - the same list the API
  prices a brew's learning weight from - so a badge can never disagree with what
  that cup was recorded as being worth. Read from the cups rather than from the
  recipe: what a recipe was written around and what was actually missing that
  morning are different facts, and only the second explains a disappointing cup.
  They are outlined rather than filled, because a cabin morning is a fact about
  that morning and not a mistake somebody made.
- **The insights print counts and say so.** Origins, processes and roast levels,
  ranked by summed `profile_learning_weight` rather than by raw count, so ten
  measured cups outrank ten made with no scale. No score, no percentage, no
  stars - this product has never measured how much anybody liked a cup, and one
  line under the numbers says exactly that. Below `INSIGHT_MIN_BREWS` the list
  is empty and the screen says what would change it: "najčastejšie Etiópia"
  means one thing after forty cups and nothing at all after three.
- **The one conclusion it draws is offered, never applied.** The suggestion is
  built from behaviour - what somebody reached for - rather than from anything
  they said, and an app that quietly rewrote a profile from behaviour would be
  arguing with somebody about their own taste without telling them. Both buttons
  are the same size, because refusing has to look reasonable: people buy what
  the shop had, drink what they were given and finish a bag they did not much
  like.
- **The paragraph beside the numbers is the only part a model writes**, and the
  card says when the phone wrote it instead. The reasons arrive machine-named
  with their own counts, exactly as the conversion report does, so the sentence
  is the same either way and only its author differs.

### What the model calls cost

`/ai-costs`, reached from the profile, and the one screen whose job is to make
a limit legible rather than punitive.

- **Both windows and both ceilings.** The day catches a screen retrying in a
  loop before it has cost anything; the month is the actual budget. Showing one
  of them would leave somebody refused with room on the bar they can see.
- **A reset is a moment, not a shrug.** `resetsAt` arrives as an instant in UTC
  and is printed in the reader's own timezone. "Skús to neskôr" is not something
  anybody can act on; "o 40 minút" is.
- **A refusal reads as a state.** `resolveAiLimitNotice` parses the error's
  `details` against the shared schema and writes which allowance ran out, when
  it comes back, and - the sentence that matters - that brewing from a stored
  recipe, adding a bag by hand and the whole history keep working. Falling back
  to the general "príliš veľa pokusov" would be an accusation with nothing to do
  about it.
- **The screen and the enforcement read the same rows.** The summary is computed
  by the API from `ai_usage_logs`, not summed from a page the app happens to
  hold, so the figure somebody is shown cannot disagree with the one that
  refuses their next scan.

### Taking the data away

- **The export is a button, not a promise to send something.** `GET /me/export`
  returns every user-owned table whole; the app writes it to the cache
  directory and hands it to the system share sheet. Cache rather than documents
  on purpose: this is a copy on its way somewhere else, and leaving a second
  copy of somebody's entire account in app storage would be keeping more of
  their data than they asked for, not less.
- **It sits directly above the deletion**, in the account group at the bottom
  of the profile screen, and says so. The two answer the same question about
  what this account _is_, and somebody deciding whether to leave is entitled to
  see what leaving takes with it - which is only true if they are on the same
  screen.
- **Nothing about it is cached.** A mutation rather than a query, because
  reading every row an account owns should never happen because a screen was
  opened - and a copy of it in the query cache is a copy nobody asked us to
  keep.

### What the app reports about itself

- **Two ports, both absent by default.** `lib/errorTracking` and `lib/analytics`
  are written against the wire format rather than pulled in as SDKs. What this
  app needs from an error reporter is one POST of newline-delimited JSON; an SDK
  would also install global handlers, patch the fetch it does not own and
  collect breadcrumbs from a UI whose error handling, offline behaviour and
  Slovak copy are already decided.
- **Almost no failure is worth reporting.** A 404 for a coffee that is not
  there, a 422 for a malformed form, a 429 for a spent allowance and a request
  that never left a phone in a cellar are all the app working. Only what nobody
  planned for goes out, decided once in the query client rather than per screen.
- **What travels is the error, the platform, the release and a screen name.** No
  request bodies, no email, nothing anybody typed about their coffee. A crash
  reporter is not a reason to make an exception to that.
- **A flow step is declared on the mutation, not called at the screen.** The
  moment worth counting is the server having said yes; a funnel built from taps
  counts intentions, and half the interesting question is how often an intention
  fails. The properties are short machine values only - the shared schema
  refuses anything long enough to be a sentence, because a field that could hold
  free text eventually would.
- **The queue is on disk and bounded.** These are recorded exactly where signal
  is worst - in a shop, in a cabin kitchen - so they survive the app closing;
  and past the ceiling the oldest go first, because what somebody did this
  morning is what anybody would want to know.

### The cupboard

- **It is sorted by what to drink this morning, not by what was added last.**
  `groupBagsByFreshness` puts the shelf in the order somebody standing in front
  of it reads it: ready now, then what will be lost if it keeps waiting, then
  what is still fine, then what is not ready yet, then what carries no roast
  date to judge by at all. Newest-first - what the API returns, and what this
  screen printed - answers a question nobody asks at a shelf, and it buried the
  one bag worth opening under two that were still resting. An empty band is
  left out rather than given a heading with nothing under it.
- **A group heading is not a bag's badge.** A badge names one bag's state
  ("Ideálne teraz"); a heading names a shelf and says what to do with it
  ("Pripravené na varenie"). Reusing one for the other produces headings that
  read as if the whole group were a single bag.
- **The ways to fill it are at the top, and they are tiles.** They used to be
  two full-width grey buttons under the list, which meant the more coffee
  somebody owned the further they had to scroll to add more. The grinder
  catalogue is last and quiet: it is a reference book about equipment on a
  screen about coffee, and at the same weight as the two actions it was
  competing with them for no reason.
- **The strip across the top and the home screen's tile are one function.**
  `summariseInventory` lives in `inventory` for that reason - the two are one
  tap apart, and a person who can see both within a second is a person who will
  notice them disagreeing.
- **A bag is a card, not a list row.** The two things wanted at a glance - how
  much is left and whether it is ready to drink - are facts about the bag, not a
  subtitle under its name. How much is left is drawn as well as written, but
  only when the bag's own weight is known too: "180 g" means nothing until you
  know whether the bag held two hundred or a kilo, and a bar drawn against a
  guessed capacity would be a picture of a measurement nobody took.
- **The card carries one button, not two.** Opening the coffee is the whole
  card, so the "Otvoriť" beside "Dopil som ju" was a second copy of a tap the
  reader had already made - and two buttons of identical weight made the
  destructive one look like the ordinary choice.
- **The resting indicator has four bands, not three.** Under five days it is
  still resting, five to twenty-one is the window, and past thirty it is aging.
  The band between them is the honest consequence of the other three: a
  three-week-old bag is neither at its best nor going off, and saying so beats
  rounding it into a neighbour. These are narrower than the `RESTING_DAYS` the
  shop verdict argues with, and deliberately a different thing - that one asks
  whether a bag is worth buying at all, this one asks what to do with it this
  morning.
- **A bag nobody weighed says so rather than showing a zero.** Zero grams and
  "not recorded" are different facts, and only one of them means somebody has to
  go shopping.
- **A finished bag is archived, never deleted**, because the brew logs point at
  it and a bag somebody drank their way through is the most valuable history
  this app has.
- **A bag's own screen splits its recipes by method.** A recipe belongs to the
  pair (bag, method), not to the coffee: the same beans want a different dose in
  a V60 than in an AeroPress, and one flat list would invite somebody to read
  one method's numbers as an improvement on another's.
- **Only what is recorded is printed.** A row of dashes where a farm would be
  tells somebody nothing except that the app has a farm field.

### What the app admits about itself

`confidence_level` is not decoration, so it is not only on the profile screen.

- **`ConfidenceNotice` sits next to every recommendation** - the quick brew
  recipe and the shop verdict - and reads the profile itself rather than taking
  one as a prop, so adding the caveat is one line at the call site. A
  disclaimer somebody has to remember to add is one that will eventually be
  left off.
- **It says which of three things is true**: nothing is known, only the
  questionnaire is known, or a couple of brews are behind it. Above `medium`
  confidence there is no notice at all: a caveat that never goes away is read
  as boilerplate, and then the honest ones stop being read too.
- **The profile screen says what would raise it**, and links to the one thing
  that actually does. A confidence figure with no way to move it is a score,
  and nobody asked to be scored.

### Loading, empty and failed

- **`QueryState` is the waiting room every screen shares.** One component for
  the two states that otherwise turn into a blank screen: a query that has not
  answered yet, and one that failed. The failure always carries a retry.
- **No raw error code ever reaches the interface.** `resolveRequestErrorKeys`
  maps every `ERROR_CODES` value and every client-side failure onto a Slovak
  sentence, and the map is total, so a new error code is a type error here
  rather than a `CONFLICT` on somebody's screen.
- **Being offline outranks whatever code came back.** A request that never left
  the phone failed for a reason the user can see out of the window; telling
  them the server had a problem would send them looking in the wrong place.
- **`EmptyState` takes a list of actions rather than one.** An empty screen
  with nothing to press is a dead end, and the two or three ways forward are
  exactly what makes an empty screen useful.

### The grinder catalogue

The first product screen: `/grinders`, reached from the inventory tab.

- **Search is a server query, not a filter over a page.** `GET /grinders`
  takes `search`, and every word of it has to appear somewhere in the brand and
  the model together, so "1zpresso pro" and "pro 1zpresso" both find the JX-Pro.
  Wildcards typed into the box are escaped: `%` is a character somebody typed,
  never a query they wrote by accident.
- **Typing is debounced, not throttled at the request.** `useDebouncedValue`
  holds the term until it settles, and the settled term travels in the query
  key, so each term keeps its own cache entry.
- **Every entry says how much its numbers are worth.**
  `resolveGrinderPrecision` reduces an entry to measured, estimated or missing,
  and the list prints the matching sentence underneath it. A micron figure
  reads like a fact whatever it says, so the interface is the place that has to
  disagree.
- **Not finding a grinder is a normal outcome.** The empty state offers the add
  form, and so does a button under the list. The form asks for brand, model,
  scale, range and step - never a calibration curve, because nobody has one to
  hand and an entry without one still works.

### Onboarding

The first run, on one route (`/onboarding`) with nine steps: welcome, taste,
grinder, brewers, gear, water, sets, calibration, done. One route rather than
nine, because the steps are a single conversation - going back a step must not
pop somebody out of the flow.

- **The state lives on the server**, in `users.onboarding_state`. Three fields
  carry two facts and the combination _is_ the state machine:
  `completedAt === null` means still inside the flow; `completedAt` set with
  `currentStep === null` means finished; `completedAt` set with `currentStep`
  still named means they left early, at that step. There is deliberately no
  `skipped` flag - it would be a third field restating what the other two
  already say, and two of them could disagree.
- **Every screen can be left**, and says so. Onboarding a user cannot escape is
  onboarding they leave the app from instead, and whatever they answered so far
  is already saved.
- **`OnboardingGate` only ever redirects _into_ the flow**, once per account.
  Leaving is the flow's own business; a gate that also pushed people out would
  fight the step machine every time it moved, and the last screen would bounce
  back into the flow through the gap before its optimistic write lands.
- **`ONBOARDING_FLOW_VERSION` invalidates a stored state.** "You were on step
  five" means nothing once step five is a different screen, so a state from an
  older version is started over and its answers are dropped with it.
- **The profile screen reopens a single step** through `/onboarding?step=<id>`.
  One screen for "which grinder", used the first time and every time after -
  and in that mode the step saves its own changes and returns, without claiming
  the whole flow was completed.

### The taste questionnaire

One question per screen, answered by tapping a card - no confirm button,
because the card the finger is already on is the confirmation. Which questions
get asked is itself the first question.

- **Three levels, because one questionnaire cannot serve both ends of this.**
  Asked to rate the acidity they want, somebody whose coffee has always come
  out of a capsule machine either guesses or picks the middle - and a guess
  folded into a profile is worse than a question never asked, because the
  profile then acts on it. Asked instead which chocolate they prefer, a
  competition barista answers accurately and tells us almost nothing: they can
  say what they want from a cup directly, and routing that through a proxy
  throws the precision away. So `beginner`, `regular` and `expert` get
  different questions rather than the same ones watered down. The five axes,
  the fold and the stored profile are identical across all three; only the
  evidence differs, which is the one thing that should.
- **The level is asked, not guessed.** There is nothing to guess from - this is
  the first screen of a brand-new account, before there is a cupboard, a brew
  or a piece of equipment written down. The three options are described by what
  somebody drinks rather than by a rank, because "začiatočník" is a label a
  person has to accept about themselves to get past the screen, and enough
  people would overclaim to avoid it that the question would stop working.
- **One catalogue, filtered.** `TASTE_QUESTIONS` holds every question in the
  order they are asked and each names its own audience through
  `QUESTION_LEVELS`; `resolveLevelQuestions` is the filter. Three hand-kept
  lists would overlap heavily - everybody is asked what ruins a cup for them
  and how they take their milk - and a question that had to be added to two
  lists is one that ends up in one. Filtering in the catalogue's own order also
  keeps the alternation, so a beginner is not handed the four plain-language
  questions in a block.
- **Direct and indirect questions alternate.** Ten questions about coffee in a
  row turn into an exam somebody feels unqualified to sit. A question about
  tea, fruit or chocolate between them keeps it a conversation, and below the
  expert level is the better evidence of the two: most people cannot say how
  much body they want, but everybody knows whether they reach for milk
  chocolate or dark.
- **The beginner questions go around the word rather than through it.**
  "Kyslosť" is the most misunderstood word in coffee: to somebody who has never
  had a light roast brewed properly it means a cup that has gone off, so asked
  whether they want an acidic coffee they say no and mean something else
  entirely - and that answer is recorded at full confidence. `fruit` asks about
  the same axis in words nobody can misunderstand, and `everydayCoffee` starts
  from the reference point every recommendation will actually be judged
  against.
- **The expert questions have no proxies at all.** `origin` and `process`
  because they are where specialty drinkers actually disagree with each other,
  and `extraction` because it is the single most useful answer in the whole
  questionnaire: everything else describes a coffee, and that one describes
  what to do with it, which is what the recipe engine and the conversation
  after a cup are deciding. Origin is weighed as behaviour rather than as a
  preference, for the reason the insights screen already states out loud -
  people also buy what the shop had.
- **One file per question** under `constants/tasteQuestions/`, each carrying its
  options, its audience and what each option claims. Adding a question is a file
  and a line in the index.
- **The answers fold into one observation, not a dozen events.** Every option
  states where this person's cup sits on an axis, so several answers about the
  same axis are averaged, weighted by how far their question is trusted.
  Separate events would let the last question shout down the ones before it
  simply by arriving last.
- **How much the answers agreed with each other travels with them.** The mean
  of two contradictory answers looks exactly like the mean of two that agreed,
  and until now the profile could not tell them apart. `foldAxisObservations`
  measures the weighted deviation as well as the mean, and each axis leaves
  with an `axisWeights` figure built from that agreement and from how much was
  asked about it at all. Somebody who says they cannot stand a sour cup and
  four questions later that they want something bright has said two honest
  things describing different drinks: the mean is still recorded, because it is
  the best guess available, but it arrives marked as a guess instead of as a
  finding.
- **The level scales the submission, never a value.** What somebody answered is
  what the profile records whichever level they picked; `TASTE_EXPERIENCE_TRUST`
  only decides how much the app may then claim to know them. An inference from
  tea and chocolate is real evidence worth slightly less than a direct
  statement - not evidence to be argued with.
- **`sourceRef` carries the level beside the fingerprint** (`q-2-expert-<hash>`,
  FNV-1a from `lib/fingerprint`). Identical answers are the same evidence and
  count once, which makes a retry on a flaky connection safe. The level is part
  of the identity rather than of the hash because the same taps against a
  different set of questions are a different statement about somebody, and
  coming back to answer properly has to count as the new evidence it is.
- **The level is stored beside the answers**, in `onboardingState`, because the
  answers alone do not say which questionnaire they came from - and read
  against the wrong set they are evidence about questions nobody was asked.
  Choosing a level clears the previous answers for the same reason.
- **Each tap is written to the server before the next question appears**, so
  closing the app halfway through loses nothing. The taste event itself is sent
  once, at the end.

### How an answer becomes a profile

The arithmetic the whole product rests on, and the one thing in it that is
allowed to be slow to change.

- **Neutral is a placeholder for silence, not a position.** Every axis starts at
  the middle of the scale, and the reducer used to blend the first observation
  towards it - which averages a real statement with a stand-in for nobody having
  said anything. Somebody who stated plainly that they cannot stand a sour cup
  was recorded a third of the way back towards neutral and told they like a
  mildly acidic coffee, and five axes treated that way produce a chart that is a
  slightly dented pentagon whatever anybody answers. So the first thing heard
  about an axis is now taken at its word, and everything after it blends
  normally: the second observation is the first point at which there are two
  real statements to weigh against each other.
- **What the first observation costs instead is confidence**, which is a
  separate number and is shown as one. Evidence counts what was heard, never
  how far the value moved - adopting an axis outright on the strength of one
  remark and then recording that as certainty is the mistake this split exists
  to stop making.
- **Confidence is per axis as well as overall.** One figure for the whole
  profile cannot say the thing that matters: an account is routinely well
  understood on the one axis it keeps complaining about and blank on the other
  four, and a single number averages those into a half-truth about both.
  `axis_confidence` is what lets the chart draw a vertex it has earned
  differently from one it is guessing at.
- **The profile is still exactly the fold of its events.** Which means a change
  to the fold makes every stored row stale, and `isStaleProjection` says so: a
  positive overall confidence over five axes that all claim to have been earned
  from nothing is a state the current reducer cannot produce, so such a row is
  rebuilt on the next read. A migration can add a column but cannot replay
  anybody's events.
- **The agreement arithmetic lives in `@brewmate/shared`**, with its own unit
  tests, for the same reason the recipe conversion does: it is how a set of taps
  becomes a claim about somebody's taste, and arithmetic that consequential has
  to be checkable in a second against plain values, with no database, no model
  and no phone.

### The calibration brew

Optional, offered after the questionnaire: Brewmate proposes one reference
recipe for the gear the user just wrote down, they brew it, and they describe
the cup in their own words.

- **The screen opens by saying it is not a test.** Somebody who thinks they are
  being marked brews more carefully than they ever will again and describes the
  result the way they think they should - the one outcome that makes this step
  worthless.
- **The description is read by a Slovak keyword lexicon**, not by a model:
  deterministic, offline, and - the part that matters - showable back to the
  drinker word for word before anything is written. "Rozumiem tomu takto" is
  only an honest sentence if the app really can say what it understood.
  Understanding nothing is a normal outcome and saves nothing.
- **The lexicon reads preferences, not measurements.** "Bola príliš kyslá" is a
  complaint about this cup and a statement about the next one, so it lands as a
  low acidity preference. Order is the mechanism: specific phrasings come first,
  so "nebola horká" is matched before the bare "hork" inside it, and each axis
  is claimed only once.
- **The description is stored as a chat message on the recipe**, and the taste
  event points at that message id. What the app concluded can always be traced
  back to the sentence somebody actually wrote, and re-sending it counts once.

### The profile screen

Everything the app believes about somebody, and every way to change it: the
five axes as a bar chart, the flavour tags it has an opinion about, the
confidence indicator, the cupboard, the water, the sets, and the two ways out
of the product.

- **It is four groups, not a column of cards.** The screen answers four
  different questions - what the app believes about you, what you brew with,
  what the app itself is doing, and what your account is - and read as eight
  cards of identical weight, finding any one of them meant reading every card
  title. `SectionHeading` labels each group and has no surface of its own: a
  label that looks like the content it labels is not a label.
- **Who is signed in is at the top, and only that.** An address is identity,
  and identity belongs above what the screen says about that person rather than
  buried seven scrolls down beside the way out. What can be _done_ to the
  account stays in the account group at the bottom, where somebody goes
  deliberately.
- **A card that ends in a second heading is a card asking to be two.** Reading
  the profile and correcting it are different acts, so they are different
  cards; signing out and deleting the account likewise.
- **The two destinations are tiles**, the same ones the home screen is built
  from. Both are places to go rather than things to read, and a button inside a
  card whose heading had been borrowed from the screen it led to was the least
  legible thing on this page.
- **The profile is drawn as a web, not as five bars.** Five bars against a 0-10
  scale asked the reader to do three things before they learned anything: hold
  the scale in their head, work out where its middle was, and then decide
  whether 7,4 was a lot. A five-sided web answers all three at once - the shape
  leans towards what somebody wants and away from what they do not, and nobody
  has to be told which direction is which. Always the same five axes, in the
  same order, against the full scale, so a profile that has barely moved off
  the middle looks like one and the same profile is recognisable a month later.
- **A vertex the profile has earned is solid; one it has heard nothing about is
  an outline**, with its name muted beside it. A polygon cannot have a hole in
  it, so an unknown axis is still drawn - at the middle, where the profile
  stores silence - and this is where the chart says which of the five are real.
  Without it a neat pentagon through five middles reads as a considered opinion
  about somebody nobody has asked anything.
- **`TasteReading` prints the same five in words, and never as numbers.**
  "Kyslosť 7,4" is a measurement of something nobody measured - it is a
  weighted average of a handful of answers about chocolate and tea - and a
  decimal place invites the reader to argue with the digit instead of with the
  claim. The band words are per axis rather than shared: a low body is "ľahké",
  not "nízke", and Slovak declines the adjective for the noun it belongs to.
- **The confidence line matters more than the chart.** A profile built from one
  questionnaire is a guess, and a guess drawn neatly stops looking like one.
  `confidenceLevel` is shown as one of four words rather than a percentage -
  "0,18" invites the reader to believe the second digit - with the brew count
  beside it, because "celkom slušne" after no brews means something different
  from the same word after twenty.
- **Two ways to correct it, side by side.** Answering the questionnaire again is
  evidence; moving the sliders is an instruction. The manual event is sent from
  the most trusted source at full weight, so what the user leaves on the sliders
  is what the profile says afterwards - anything less would be an app arguing
  with somebody about their own taste. Its `sourceRef` fingerprints the values,
  so saving the same sliders twice counts once.
- **A flavour tag the app has no Slovak word for is printed as it was stored**,
  the way a coffee's variety is. The vocabulary belongs to the world.

### Equipment, and what it is for

- **A brewer points at a brew method** through `params.methodId`, and that link
  is the whole reason the cupboard is written down: a method nothing points at
  is never offered. `useAvailableBrewMethods` is the one place that rule lives,
  and the brew screen shows its result.
- **The screen offers methods, not equipment types.** Nobody thinks of a V60 as
  "a piece of equipment of type brewer with a method id"; they think of it as
  the thing they make coffee in. Each tick writes or removes the row behind it.
- **Everything measurable is optional.** A brewer nobody measured is still a
  brewer, and Brewmate would rather say it does not know a kettle's capacity
  than assume one and recommend a dose that overflows it.
- **"Nemám" is a first-class answer** for the scale and the grinder. It changes
  what the app may recommend, and the API prices exactly that difference into a
  brew's learning weight.
- **A set introduces no equipment.** It is a named selection of what is already
  owned, plus what that place is usually missing, and the default one switches
  with a single tap above the brew screen.

### The design system screen

`/design-system` is development only - in a production build the route
redirects home, and the way in from the profile screen is hidden. It renders
every token and every component, with a switch for light, dark, or both schemes
side by side. Without it there is no way to check that the pieces fit together.

### Authentication

The app signs in with **email + password, Google and Apple** - Apple is not
optional next to Google, an app that offers one third-party login without
Apple's does not pass review.

```
src/features/auth/
├── constants/   auth status, provider ids, Firebase error codes
├── services/    one file per action; the only place a provider error is read
├── context/     AuthProvider + useAuthSession, fed by onIdTokenChanged
├── hooks/       useAuthMutation/useAuthAction, the social hooks, the route guard
└── components/  the four screens, the shared form, the account card, AuthGate
```

- **The flow is splash -> sign-in/registration -> app.** `AuthGate` holds the
  splash screen until Firebase has said who the user is, so the first screen a
  user sees is already the right one. `useProtectedRoute` then keeps the visible
  screen and the session in step in both directions.
- **Tokens refresh themselves.** Firebase renews an ID token shortly before it
  expires and `firebaseTokenProvider` hands the current one to every request.
  The app tracks no expiry of its own.
- **Sessions survive a cold start** because `getFirebaseAuth` wires Firebase Auth
  to AsyncStorage. Without an explicit persistence the React Native build keeps
  the session in memory only.
- **The backend user is provisioned by the first `/me` call**, which `AuthGate`
  makes as soon as anyone signs in.
- **Errors are Slovak sentences.** `resolveAuthErrorKey` is the only code that
  reads `error.code`; every screen renders a translation key. A raw
  `auth/invalid-credential` must never reach the interface.
- **Being offline is a state, not a failure.** `useIsOnline` puts a notice above
  the form and blocks the submit button before an attempt is made; the network
  error code is mapped as a backstop.
- **Deleting the account is in the app**, as Apple has required since 2022 of
  any app that can create one. `DELETE /me` removes the stored data and the
  Firebase identity, and the app signs out and empties the query cache.

Google Sign-In is optional: a build without `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID`
hides the button rather than failing when it is pressed. Apple's button hides
itself wherever the platform does not support it.

### Two typing augmentations

`src/types/firebaseAuth.d.ts` declares `getReactNativePersistence`, which the
React Native bundle of `firebase/auth` exports at runtime but leaves out of the
package's published typings.

`src/types/audioAssets.d.ts` declares that a bundled `.wav` resolves to an
asset handle, which is what Metro has always done with it and what
`expo-audio` takes as a source.

Both declare what is already there rather than asserting a type over it, so
Rule 3 is untouched.

### One inline lint exemption

`src/i18n/translationKeys.ts` carries a single `eslint-disable-next-line` for a
type assertion, with the reason written next to it: `Object.fromEntries` cannot
express "every key mapped onto itself". Rule 3 allows exactly this, and it is
the only one in the app.

---

## 6. Server architecture

```
server/src/
├── index.ts          Bootstrap: load env -> config -> dependencies -> listen
├── app/              buildApp (no listen, so tests can inject), DI wiring, shutdown
├── config/           Env schema (Zod), AppConfig, per-concern resolvers
├── constants/        HTTP status, methods, server + database defaults, time units
├── logging/          Pino options, redaction paths, log messages
├── db/               Drizzle client, schema, migrations
├── errors/           AppError, typed factories, error handler, not-found handler
├── ai/               Model, image and label-reader ports, the Anthropic, HTTP and
│                   Google Vision implementations, photo assessment, pricing
├── auth/             Token verifier + identity deleter, Firebase implementations, auth plugin
├── modules/          one domain each: repository -> service -> routes + mapper
│   ├── ai/           the eight routes that cost money, the auxiliary
│   │                 profileTuning call, the coffee taste reading and its
│   │                 shared cache, the brew context reader, the versioned
│   │                 prompts, the model routing table and completeJson
│   ├── health/       healthService + healthRoutes
│   ├── users/        the account behind a Firebase identity
│   ├── tasteProfiles/ profile, its audit trail and the fold that rebuilds it
│   ├── brewMethods/  the method catalogue, as data
│   ├── grinders/     the shared grinder catalogue, extensible by users
│   ├── equipment/    what somebody owns
│   ├── equipmentSets/ saved combinations of it
│   ├── coffeeBags/   the cupboard
│   ├── bagEvaluations/ "should I buy this bag?", asked and answered
│   ├── recipes/      one way of brewing one coffee
│   ├── recipeChat/   the conversation about a recipe
│   ├── brewLogs/     cups that were actually brewed
│   ├── history/      one recipe line, with its cups and its notes
│   ├── insights/     what a stretch of brewing adds up to
│   ├── analytics/    the named flow steps a phone reports
│   └── aiUsage/      model calls, recorded for cost - and the allowance
├── telemetry/        error tracker port + a Sentry-envelope implementation
└── types/            Fastify module augmentation
```

The dependency direction is one way:

```
routes -> service -> repository -> drizzle
```

A route handler never touches the database and never contains a rule. A service
never touches Fastify's request or reply.

### Dependency injection

`buildApp(dependencies)` takes
`{ config, db, tokenVerifier, identityDeleter, ai }`. Production wiring lives in
`createAppDependencies`; integration tests pass a stub verifier, a recording
deleter and a recording model. Nothing in `src/` reaches for a global singleton.

`ai` is `{ completionClient, imageFetcher }` or null - one nullable field rather
than two, because a model with no way to fetch the photograph and a photograph
with nothing to read it are both half a feature, and two fields that must agree
are two fields that eventually will not. Null is a working state: a deployment
without `ANTHROPIC_API_KEY` serves every screen that asks no model anything, and
the AI routes answer 503, which the app shows as "zadaj to ručne".

`createBrewContextResolver` is built once and shared by the recipe engine and
the chat. Two readers of "which brewer, which kettle, which grinder" would be
two answers to the same question, and the recipe and the advice about it would
eventually disagree about what is on the counter.

### Auth flow

1. `Authorization: Bearer <firebase id token>`
2. `extractBearerToken` parses the header (401 if absent or malformed)
3. `TokenVerifier.verifyIdToken` validates it - Firebase Admin in production
4. `userService.provisionFromIdentity` maps `firebase_uid` to an internal user,
   creating the row on first login (an upsert, so two concurrent first requests
   cannot race into a duplicate key error)
5. the user is exposed as `request.currentUser`, read via `requireCurrentUser`

`TokenVerifier` is an interface on purpose: real Firebase ID tokens cannot be
minted in CI, and the HTTP layer must be testable without a live identity
provider. `IdentityDeleter` is separate for the same reason - it is the one
thing the API does _to_ Firebase rather than _with_ it.

### Deleting an account

`DELETE /me` erases the stored data first and the Firebase identity second. If
the identity call then fails, the request fails and a retry converges: the next
authenticated call re-provisions an empty row, deletes it again and retries the
identity. The reverse order could strand personal data behind an identity nobody
can sign in as. Deleting an account that is already partly gone is a success.

### Which model answers which question

`AI_MODEL_ROUTES` maps every function name onto a model, and the record is
total over `AiFunctionName` - adding a function is a type error here rather
than a call that quietly defaults to the expensive model.

- **The split is by what the answer has to be, not by how long it is.** Reading
  a label, writing a verdict, writing a recipe, answering what somebody said
  about a cup, reading and converting somebody else's recipe and dialling an
  espresso in are all cases where being wrong costs a bag of coffee or a
  morning. Those go to Sonnet.
- **`tune-profile` is the one auxiliary call, and the only one on Haiku.** Every
  number in that answer was computed in code from the brew logs before the model
  was asked anything, and its schema has nowhere to put a different one. That is
  typing rather than reasoning, and paying reasoning rates for typing is how a
  per-user allowance gets spent on nothing.
- **The function name is declared once, on `completeJson`**, which resolves the
  model from it and carries both back on the completion. The row that bills a
  call and the model that answered it therefore cannot describe different
  features.
- **Cost is priced against the model that was asked for**, not the dated variant
  named in the answer. Looking a price up by the provider's string would need a
  table of every dated name, or a prefix match that silently prices an unknown
  model at zero. All four token tiers are priced separately per model, because
  caching is what makes these prompts affordable at all.

### The allowance

Daily and monthly, in calls and in money, enforced by one `preHandler` in front
of `/ai/*` and in front of nothing else.

- **A hook rather than a line in each handler.** The rule is "the routes that
  cost money", and a handler that forgot the line would be a hole nobody notices
  until an invoice.
- **Both measures, because they guard different failures.** Calls are what runs
  away; money is what hurts. A recipe and a one-line chat answer cost very
  different amounts, so counting either alone leaves one failure unguarded.
- **Nothing else is behind it.** An account at its ceiling can still brew from a
  stored recipe, add a bag by hand, read its whole history and open the
  insights. A limit that took those away would be punishing somebody for having
  used the app.
- **The refusal carries which ceiling, which window and when it lifts**, in
  `details` on the error envelope, so the app can write a sentence somebody can
  act on rather than parse one written for a log. The month is reported before
  the day: somebody out of both needs the one that lasts longer.
- **Both windows roll over in UTC**, stated once in `resolveUsageWindows` and
  carried to the app as an instant. A limit anchored to the phone's timezone is
  one that resets twice for somebody flying west, and the server has no honest
  way to know which zone a request came from.
- **`GET /insights` is not behind the allowance**, and checks it itself before
  spending. The report is arithmetic and has to keep working; only the paragraph
  costs anything, it is cached per fingerprint, and when it cannot be had the
  card is plainer rather than broken.

### Where failures go

`ErrorTracker` is an interface for the same reason `TokenVerifier` is one: the
real implementation talks to a third party over the network, and neither the
tests nor a deployment without a DSN should have to.

- **Only unhandled failures are reported.** A 404, a 422 and a 429 are the API
  working exactly as designed; sending those to an alerting tool is how a team
  learns to ignore it. What goes out is what the log also calls an unhandled
  error.
- **A report carries the route pattern, two ids and nothing else.** The pattern
  rather than the URL, so an id in a path never leaves the building; the
  internal account id rather than an email; nothing from the body or the query
  string. `redactPaths` already decides what may be logged, and a reporter that
  quietly sent more would make that decision meaningless.
- **Capturing cannot fail a request.** The failure it describes has already been
  turned into a response, and making somebody's request wait on a third party's
  availability would turn a reporting outage into a latency problem for every
  500 the API returns.
- **A malformed DSN is a warning, not a start-up failure.** Error reporting is a
  thing added on top of the log, and a typo in it must not be able to take the
  API down.

### Error shape

Every non-2xx response, without exception:

```json
{
  "error": { "code": "UNAUTHORIZED", "message": "...", "details": null },
  "requestId": "req-1"
}
```

`code` comes from `ERROR_CODES` in `shared`. Clients branch on the code, never
on the message. Throw an `AppError` (via `unauthorizedError`, `notFoundError`,
`badRequestError`, `internalError`); the central error handler does the rest.

### Endpoints

`/health` is the only unauthenticated route. Everything else requires a Firebase
ID token and is scoped to the caller _in the WHERE clause_ - a row belonging to
somebody else answers with the same 404 as a row that does not exist, so the API
is not an oracle for other people's ids.

| Method           | Path                           | Purpose                                          |
| ---------------- | ------------------------------ | ------------------------------------------------ |
| GET              | `/health`                      | liveness + database check (503 when degraded)    |
| GET/PATCH/DELETE | `/me`                          | the account; PATCH edits name, water, onboarding |
| GET              | `/me/export`                   | every user-owned row, in one document            |
| GET              | `/taste-profile`               | the profile, neutral until something teaches it  |
| GET/POST         | `/taste-profile/events`        | the audit trail; POST is safe to retry           |
| POST             | `/taste-profile/recompute`     | rebuild the profile from its events              |
| GET              | `/brew-methods`                | the method catalogue                             |
| GET/POST         | `/grinders`, `/grinders/:id`   | the grinder catalogue, searchable and extensible |
| CRUD             | `/equipment`                   | what the user owns                               |
| CRUD             | `/equipment-sets`              | saved combinations of it                         |
| CRUD             | `/coffee-bags`                 | the cupboard; DELETE archives, it does not erase |
| GET/POST/PATCH   | `/bag-evaluations`             | verdicts on bags seen in a shop                  |
| CRUD             | `/recipes`                     | recipes; DELETE is refused once one was brewed   |
| GET/POST         | `/recipes/:id/messages`        | the conversation about a recipe                  |
| CRUD             | `/brew-logs`                   | cups actually brewed                             |
| GET              | `/ai-usage`                    | this account's model usage; read-only by design  |
| GET              | `/ai-usage/summary`            | both windows, their ceilings, and where it went  |
| GET              | `/history/timeline`            | one recipe line: versions, cups and notes        |
| GET              | `/insights`                    | what the history counts, and what it proposes    |
| POST             | `/insights/suggestion/accept`  | writes the proposal into the taste profile       |
| POST             | `/insights/suggestion/dismiss` | remembers a refusal against that evidence        |
| POST             | `/analytics/events`            | a flushed batch of named flow steps              |
| POST             | `/ai/parse-coffee-bag`         | reads a photographed label into the bag's fields |
| POST             | `/ai/evaluate-coffee`          | writes the shop verdict and stores it            |
| POST             | `/ai/estimate-coffee-taste`    | what is in the bag, on the profile's own axes    |
| POST             | `/ai/generate-recipe`          | writes and stores the recipe for one brew        |
| POST             | `/ai/recipe-chat`              | answers what somebody said about a cup           |
| POST             | `/ai/parse-recipe`             | reads a found recipe into fields, holes and all  |
| POST             | `/ai/convert-recipe`           | converts it onto this person's own equipment     |
| POST             | `/ai/espresso-dial-in`         | records one shot and proposes one change         |

Every list endpoint takes `limit` and `offset` and answers
`{ items, limit, offset, hasMore }`. `hasMore` comes from reading one row beyond
the page rather than from a `count(*)`, which on a growing table would cost more
than the page it describes.

Both request bodies and responses are validated against the shared Zod schemas.
A response that violates the contract is a 500, not a silent success.

---

## 7. Database

PostgreSQL hosted on **Neon**. There is no local database and no Docker Compose -
do not add one.

### The schema, and why it looks like this

Sixteen tables. Everything a user owns carries
`user_id references users(id) on delete cascade`, which is what makes
`DELETE /me` erase an account rather than merely disown it. The decisions worth
knowing before changing anything:

- **Closed sets the code branches on are `pgEnum`s** built from the value lists
  in `shared/src/enums/`, so a column cannot accept what the contract rejects.
  Anything only a human reads - a coffee's process, its variety - is `text`,
  because that vocabulary belongs to the world rather than to the code.
- **`brew_methods` are rows, not an enum.** Nothing branches on `key`; adding a
  method is an insert. Retired methods are flagged, never deleted, because
  recipes point at them.
- **`taste_profiles` has `user_id` as its primary key.** A profile is a
  singleton per account, so a second one is impossible rather than unlikely.
  `axis_confidence` beside the axes is `jsonb` where the axes themselves are
  real columns, and the difference is deliberate: the axes are the thing the
  profile _is_ - sorted, compared and read one at a time - while this is
  metadata about them, in the same position `source_weights` already holds.
- **`taste_profile_events` is append-only and the profile is its fold.** Adding
  an event replays the whole trail rather than patching the row, so the profile
  is always exactly what its evidence says. `source_ref`, with a partial unique
  index on `(user_id, source, source_ref)`, is what makes a repeated submission
  count once.
- **Pinned recipes need two partial unique indexes, not one.** `bag_id` is
  nullable for a quick brew, and SQL treats two NULLs as different values - a
  single index over `(user, bag, method)` would let every bagless recipe stay
  pinned. Pinning itself is done transactionally by the service; the indexes are
  the backstop.
- **`brew_logs.profile_learning_weight` is computed once, on the way in**, from
  the constraints declared for that brew. Derived on read, it would rewrite
  history: the day somebody buys a kettle with temperature control, every
  disappointing cup they made at a cabin would turn into evidence about their
  taste.
- **`grinders_catalog.created_by_user_id` is nulled, not cascaded.** The entry
  is shared data other people's equipment points at; only the attribution is
  personal.
- **`coffee_taste_readings` belongs to nobody either**, for the same reason and
  on the same key: what a model made of one coffee's label is a statement about
  a product on a shelf, so the row is shared, survives an account deletion, and
  makes the second scan of a popular bag free. It caches only the model's
  reading and never the finished estimate - the tables are re-folded on every
  read, so correcting a roast level changes the answer immediately instead of
  leaving a stale row behind, which is the same discipline that keeps a taste
  profile a fold of its events rather than a patched row.
- **`coffee_bag_parses` belongs to nobody.** It caches what was read off a
  label, under two keys: the photograph's hash, and a partial unique index on
  the normalised `(roaster_key, name_key)` pair. There is no `user_id`, so the
  row survives an account deletion the way the catalogues do - what is stored is
  a printed label, public information about a product on a shelf, and nothing
  about who photographed it. A cache scoped to one person would answer for the
  roaster-and-name pair almost never, which is the case it exists for. The
  partial index leaves unreadable labels out of the rule entirely: several
  unreadable bags are several different bags.
- **`equipment_sets.equipment_ids` is `jsonb`,** so the database cannot enforce
  those references and the service does it instead: every id must exist and
  belong to the caller, and deleting a piece of gear prunes it out of that
  user's sets. This is the one place where code stands in for the database.
- **`jsonb` only where the shape is genuinely open** - brew parameters,
  constraints, calibration curves, onboarding state. Every one of them is still
  typed by a Zod schema in `shared` and validated at the edge. This is what
  lets `brew_params` grow a total time, a pre-infusion, a grind described in
  words and a hint per missing piece of gear without a migration each - and why
  every one of those additions is optional, so a recipe stored last month still
  reads.
- **A recipe records the constraints it was written around**, as well as the
  brew log recording what was true of one cup. The two answer different
  questions: the log is history, the recipe is what its numbers assume. It is
  what lets brew mode fill the log in without asking again, and lets a
  conversation about a recipe nobody has brewed yet still know what it may
  suggest.
- **`equipment.params` stays open, but has typed corners.** A kettle and a
  scale have nothing in common, so the column accepts anything; the handful of
  properties Brewmate actually reasons about - a brewer's method, capacity, dose
  window and basket, a kettle's temperature control - are described by
  `shared/src/equipment/equipmentParamsSchema.ts` and read back through
  `readBrewerParams` and its siblings. A blob that does not match is read as
  "nothing known" rather than thrown away or asserted into shape: the column is
  open by design, so meeting something the schema does not describe is a normal
  event, not a failure.
- **`insight_suggestions` is keyed by the evidence, not by the proposal.**
  `suggestion_ref` fingerprints the counts a suggestion was drawn from, and that
  one decision does three jobs. It makes the sentence beside the numbers free
  after the first time - the arithmetic costs nothing, but putting it into
  Slovak is a model call, and a screen that rewrote the same paragraph on every
  open would pay for it all month. It makes refusing meaningful but not
  permanent: brew another dozen coffees and the fingerprint changes, so somebody
  who said no after six brews is asked again after thirty. And it makes
  accepting count once, because the taste event carries the same ref as its
  `source_ref` and the partial unique index on the audit trail refuses a second.
- **`analytics_events` carries a `user_id` and cascades like everything else.**
  That is the only honest way to hold it: an event tied to a person is personal
  data whatever it is called, so it is deleted with the account and included in
  the export. A separate "anonymous" store keyed by a device id would be the
  same data wearing a different name, and neither deletable nor exportable. It
  keeps two clocks - `occurred_at` from the phone and `created_at` from the
  server - because these are queued offline and flushed later, and only one of
  the two makes a wrong device clock visible. `name` is `text` rather than an
  enum: the list of interesting flows changes faster than a schema should,
  retiring one must not orphan its history, and nothing branches on the value.
- **`ai_usage_logs.cost_estimate` is `numeric`** and travels as a decimal
  string. Everything else here is a measurement where `real` is right; these
  rows get summed over months, and a float sum of fractions of a cent is wrong
  in the way nobody notices until the invoice.
- **`roast_date` is a `date`.** A roast date has no time and no timezone;
  stored as `timestamptz` the resting window would come out a day wrong.

Foreign keys cascade rather than restrict even where a rule says "you cannot
delete this" - a `restrict` anywhere in the graph would make deleting an account
fail against its own history. Those rules live in the services, which is where
they can answer with a 409 instead of a constraint violation.

Reference data lives in `server/src/db/seed/`. `db:seed` is idempotent: methods
are matched on `key`, grinders on brand and model, so it can be run against a
fresh branch or an existing one with the same result.

The catalogue itself is eighteen brewing methods and a little over ninety
grinders, split across `seedData/grinders/` only to keep the lists readable.
Two things there are deliberate, and changing them is a decision rather than an
edit:

- **A seeded grinder is `is_verified = true`.** That flag is about visibility,
  not accuracy: verified means the entry belongs to the catalogue everybody
  sees, unverified means it is one person's contribution and only they can see
  it. A shipped entry nobody can see would be no entry at all.
- **How good a micron curve is, is a separate question,** answered by
  `micronCalibration.isEstimated`. Published microns-per-click figures exist for
  a minority of grinders and are approximate even there, so every shipped curve
  is flagged as an estimate and most entries carry no curve at all. The app
  states which of the three cases it is on every entry. Nothing here invents a
  number to fill a hole.

Two branches:

- development branch -> `DATABASE_URL` (pooled, hostname contains `-pooler`) and
  `DATABASE_URL_UNPOOLED` (direct, used by drizzle-kit and `db:migrate`)
- test branch -> `TEST_DATABASE_URL`

When `NODE_ENV=test` the config resolver picks `TEST_DATABASE_URL` and ignores
`DATABASE_URL`, so a test run can never truncate development data.

Schema changes: edit `server/src/db/schema/`, run `db:generate`, commit the
generated SQL in `server/drizzle/`, run `db:migrate`. Never hand-edit a
generated migration that has already been applied.

---

## 8. Testing

Two kinds, and the split is deliberate.

`shared` has unit tests, and only for the conversion module, the shot timeline,
the taste axis fold and the coffee taste estimate: pure functions over plain
values, testable with no database, no model and no server. That is the whole reason the conversion lives there rather than
in the API - arithmetic this consequential should be checkable in a second. The
tests are written against the decisions rather than the implementation: that a
curve reads back the point it was measured at, that an extrapolation says it is
one and a reading far outside the measured span is refused, that the two
directions round-trip, that a converted grind is never reported as exact, that
an estimated calibration and an unverified entry are both named, that scaling to
a brewer keeps the source's own ratio, and that a ratio only moves when the
recipe crosses into another family of brewer. The taste axis fold is tested for
the one thing it exists to do that averaging cannot: that two answers pointing
at opposite drinks come out reporting they agree about nothing, while two that
repeat each other come out agreed - and that the contradictory pair still
reports the mean, because it is the best guess available and the whole point is
that it arrives marked as one.

Everything else is integration tests, running against the real Neon test branch
through `app.inject()` - no mocked database, no testcontainers (everything is
hosted).

- `tests/setup/globalSetup.ts` migrates the test branch once per run
- `tests/setup/createTestContext.ts` boots the real app with a stub verifier
- `tests/setup/testApi.ts` cuts the `app.inject` boilerplate out of every test
- `truncateTables` resets state between tests, naming only the roots -
  everything a user owns cascades from `users`
- `fileParallelism` is off: all test files share one database branch

The tests are written around the schema decisions rather than around the CRUD:
that both pinned-recipe rules hold (including the bagless one SQL would
otherwise let through), that constraints discount a brew's learning weight and
correcting them re-prices it, that a repeated questionnaire counts once, that a
recompute reproduces the stored profile exactly - its per-axis confidence
included - that the first thing heard about an axis is taken at its word rather
than averaged with the neutral it started at, that confidence is earned per axis
so an axis nobody has mentioned stays visibly unknown, that an observation may
declare which of its own axes it is less sure of, that deleting an account takes
everything but leaves a contributed catalogue entry without its author, and that
one account's rows are invisible to another.

The AI routes are tested the same way, through a recording stub model rather
than a live one: real vision calls cannot be made in CI, cost money and are not
deterministic - and none of the behaviour worth testing is the model's. What is
worth testing is everything around it: that a malformed answer is retried
exactly once and both attempts are billed, that a photograph read before is not
read again, that the same coffee shot by somebody else answers from the stored
reading, that a coffee already judged is not judged twice, and that a verdict
that will not validate is refused rather than stored broken. The taste estimate
is tested for the rule its whole design rests on: that a model insisting a dark
roast is the brightest coffee ever measured does not get its way, that a model
which will not answer still leaves a complete estimate from the label alone,
that one coffee is read once however many people scan it, and that a bag whose
label could not be read is never cached under a blank key.

The import and the dial-in are tested the same way, for the rules that a model
would break silently: that a recipe read out of pasted text keeps its holes as
nulls, that the converted dose and water are the arithmetic's whatever the
answer tries to add, that the grind is translated through both curves, that an
estimated calibration and an unverified entry reach the stored report, that a
schedule which carried over intact is refused a rewrite while one written for
another family of brewer gets one, that a dial-in answer moving both the grind
and the dose is refused and the corrected one taken, that the shot is recorded
before the model is asked anything, and that the taste event carries the shot's
own learning weight.

The brewing loop is tested for the rules that would be quietly broken rather
than loudly: that the dose and the water come back exactly as they were chosen,
that the ratio is recomputed from the grams rather than trusted, that the
declared constraints reach the prompt by machine name and their hints reach the
recipe, that a pour-over answer for an espresso method is refused rather than
stored, that a change the constraints make impossible is refused and the
corrected one taken, that a patch's ratio follows the water it moved, that the
chat's taste event carries the brew's own learning weight, and that a model
which will not answer still leaves the conversation holding what the person
said.

The history, the allowance and the export are tested for the rules that would
otherwise be quietly broken: that a report says nothing at all until there are
enough cups to say something, that the counts are counts and the suggestion
names its evidence, that accepting writes one event from its own source and
counts once however often it is tapped, that a refusal survives until the
evidence itself changes, that a ref the history no longer supports is refused,
that a timeline reads oldest-first and marks the version whose cup was brewed
with something missing, that a bagless line and a bag's line stay separate,
that the fold reproduces itself exactly on a second replay and lets a cup
brewed with nothing to hand teach the profile less, that a spent allowance
refuses `/ai/*` with which ceiling and when it lifts while leaving every other
route working, that the dashboard reports the same spending the limiter is
enforcing, that a recipe goes to the larger model and the auxiliary paragraph
to the smaller one, and that the export carries every user-owned table and
describes exactly what deleting the account erases.

Tests are skipped in CI when `TEST_DATABASE_URL` is not configured, and fail
loudly when it is set but unreachable.

---

## 9. Environment and secrets

`.env` files are git-ignored; only `.env` is tracked. Never commit a
filled-in `.env`, a service account JSON or a connection string with a password.

- `server/.env` - database URLs, Firebase Admin credentials, `ANTHROPIC_API_KEY`,
  `GOOGLE_VISION_API_KEY` / `GOOGLE_VISION_ENDPOINT` and `SENTRY_DSN`. The DSN is
  optional: without it unexpected failures are logged and reported nowhere else,
  which is a deployment choice rather than a misconfiguration. The two Vision
  variables are optional as a pair, and absent is a working state - a
  photographed label is then read by the model alone. The endpoint is a variable
  rather than a constant because Google serves that API from several regional
  hosts, and only the deployment knows which one its photographs may travel to.
- `frontend/.env` - `EXPO_PUBLIC_*` only (see Rule 6): the API base URL, the
  public Firebase _client_ configuration, the storage bucket and the Google
  OAuth client IDs. None of those are secrets; all of them identify rather than
  authorise. The model provider's key is not among them and never will be:
  every model call goes through the API, which is the whole reason
  `/ai/parse-coffee-bag` and `/ai/evaluate-coffee` exist.

  `EXPO_PUBLIC_SENTRY_DSN` and `EXPO_PUBLIC_RELEASE` join them, and belong
  there for the same reason the Firebase client configuration does: a DSN
  identifies a project to receive reports and authorises nothing, and a release
  name is a build number. Both are optional - a build without the DSN reports
  nothing anywhere and works exactly as well.

  `EAS_PROJECT_ID` and `EAS_OWNER` are read by `app.config.ts` at build time and
  are deliberately not in the repository: a project id belongs to whoever owns
  the app, and a placeholder would fail a build with a message about somebody
  else's account.

---

## 10. WebStorm

- **Package manager:** Settings -> Languages & Frameworks -> Node.js ->
  Package manager -> `pnpm`.
- **Cross-package autocomplete** works out of the box: `tsconfig.base.json`
  maps `@brewmate/shared` to `shared/src`, so Go To Definition lands on the
  source, while Node and Metro resolve the built package at runtime.
- `.idea/` is git-ignored on purpose - IDE state is personal, and the type
  resolution above is IDE-independent.

---

## 11. Definition of done

Before any change is considered finished:

1. `pnpm verify` is green (typecheck + lint + format).
2. `pnpm test` is green, or the reason it cannot run is stated explicitly.
3. No new lint exemption was added without updating section 4 of this document.
4. New values live in a constants/tokens/i18n file, not at their use site.
5. New shapes crossing the API boundary live in `shared`.
6. Anything that changes what data is collected, stored or sent anywhere
   updates `docs/app-store/privacy-nutrition-labels.md` in the same change. A
   label that describes an intention rather than the build is one Apple treats
   as a misrepresentation rather than as a mistake.

---

## 12. Shipping

The build and store material lives in `docs/`, and each file is written to be
checked rather than admired.

```
docs/
├── app-store/
│   ├── listing-sk.md                Name, subtitle, description, keywords, URLs
│   ├── privacy-nutrition-labels.md  The App Store and Play answers, each traced
│   │                                to the table or request that makes it true
│   └── screenshots.md               The six shots, in the order they argue
└── release/
    ├── backend-hosting.md           Where the API runs, what it needs, how it gets
    │                                there, and what is deliberately not there
    ├── eas.md                       Build profiles, channels, what an update may carry
    ├── go-live.md                   The order the accounts, the database, the API, the
    │                                builds and the store material have to happen in
    └── ios-submission-checklist.md  The things that fail a first submission
```

### Hosting the API

The API is a stateless Node process and everything with state in it is hosted
elsewhere - the database on Neon, the identities in Firebase, the photographs in
Cloud Storage, the model behind an API key. It keeps nothing, writes nothing to
disk and can be replaced mid-request, which is what makes hosting it a service
somebody else runs rather than a machine somebody has to own.

**`render.yaml` is that service, written down.** One web service on Render's own
Node runtime, so there is no container in the normal path and nothing to build
locally: the blueprint carries the build command, the migration step, the health
check, the region and every variable the server reads. `server/Dockerfile`
builds the same process as an image for the hosts that speak only containers -
it is not at the repository root, so nothing picks it up by accident.

Four decisions in those two files and in `docs/release/backend-hosting.md` are
deliberate:

- **The install is filtered, and the linker is overridden.**
  `--filter @brewmate/server...` takes the API and the contract and leaves the
  app out; `--config.node-linker=isolated` is needed because `.npmrc` hoists for
  Metro's sake and hoisting ignores the filter - without it a host installs
  React Native in order to compile a Fastify server. In the image, the runtime
  stage installs again rather than copying the builder's tree, because
  TypeScript, drizzle-kit and vitest have no business facing the internet.
- **Migrations are a release step, never something the server does on boot.**
  Two instances starting together would run the same migration twice, and a
  failed one during a rolling deploy would take down the instances that were
  serving perfectly well. `tsx` is a dev dependency, so a deployment runs the
  compiled `node server/dist/db/migrate/migrateCli.js`.
- **`/health` is the probe, and it answers 503 when the database is down.**
  That is the right answer for a load balancer and an awkward one for a platform
  that restarts on a failed check: a Neon branch waking from autosuspend is not
  a broken process.
- **There is no CORS plugin and no HTTP-level rate limiter.** The client is a
  phone app, so a browser preflight never happens; and what protects the invoice
  is the per-account model allowance in front of `/ai/*`, which is the only
  place a request costs anything beyond a query. Adding either is a decision
  with a reason behind it, not a default.

### EAS

`frontend/eas.json` holds three build profiles - `development`, `preview`,
`production` - each on its own update channel, with `appVersionSource: remote`
so EAS owns the build number rather than whoever remembered to bump it.

`frontend/app.config.ts` layers the environment-dependent parts on top of
`app.json`, which still holds everything static: the icons, the permission
strings and the privacy manifest. Three things are layered on, and all three
are absent by default:

- **`runtimeVersion` follows `appVersion`.** That is the honest reading of what
  a JavaScript bundle is compatible with, and it is what stops an update
  reaching a build whose native modules it does not match - the one real
  failure mode of over-the-air updating. Anything that adds or upgrades a
  native module needs a version bump and a store build. `react-native-svg` is
  one of those: the taste profile is drawn as a polygon, and a polygon is the
  one shape a stack of `View`s cannot produce. It is pinned to the version Expo
  bundles for the SDK, and it is the only third-party native module in the app
  that is not an `expo-*` package.
- **The EAS project id and owner come from the environment.** A project id
  belongs to whoever owns the app rather than to the source, and a placeholder
  would fail a build with a message about somebody else's account. Without it
  updates are simply not configured and `expo start` runs exactly as before,
  which is the right behaviour for a checkout never connected to EAS.
- **The release name is stamped into every crash report.** Without it every
  report from every version is one undifferentiated pile, and "did the fix
  work?" is unanswerable.

### The four things iOS review actually fails on

All four are verifiable in this repository, and the checklist says where to
look for each:

1. **Sign in with Apple** is offered beside Google - an app that offers one
   third-party login without Apple's does not pass review. `usesAppleSignIn` is
   set, the button hides itself where the platform has none, and the name Apple
   gives exactly once is handled as such.
2. **Deleting the account is in the app**, on the profile tab, and erases the
   stored data before the Firebase identity so a half-finished deletion cannot
   strand personal data behind an identity nobody can sign in as.
3. **Every permission string names the coffee bag** and what is read off it. A
   generic string is a rejection, and the strings in `infoPlist` and in the
   `expo-image-picker` plugin options are deliberately the same sentences so
   the two cannot drift.
4. **The privacy manifest is filled in** with six collected data types and four
   required-reason API categories, and it agrees with the nutrition labels -
   which in turn name the table or the request behind every row.

Two of them are only half-answerable from a repository, and the checklist says
so rather than ticking them: a privacy policy URL that actually resolves, and a
demo account in the review notes that has been through onboarding and has a few
brews in it. Brewmate is useless signed out, and a reviewer who cannot get past
the sign-in screen rejects on _Guideline 2.1_.
