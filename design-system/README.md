# Brewmate design system — Claude Design bundle

Twelve preview cards describing Brewmate's tokens and components, in a shape
`/design-sync` can push to a design-system project on
[claude.ai/design](https://claude.ai/design). Once it is up there, everything
designed in Claude Design starts from Brewmate's own colours, type, shape and
components instead of a generic Material default — which matters here more than
most, because this app deliberately deviates from MD3 in ways a default would
undo (see `radius.ts`: no pills).

## Pushing it

`/design-sync` needs a browser login, and a Claude Code session running on the
web cannot do that. So this runs from a checkout on your own machine:

```bash
git pull
./design-system/build.sh   # dist/ is gitignored, so build it first
/design-login              # once, in an interactive Claude Code session
/design-sync               # points at design-system/dist
```

`dist/` is not committed: the repository ignores every `dist/`, and a generated
directory that is also a source file is one that eventually disagrees with the
thing it was generated from. Building it takes a second and always matches the
parts beside it.

`/design-login` is a one-off: headless and SDK runs afterwards reuse the
authorization. If you would rather go the other way, Claude Design's
"Send to Claude Code Web" seeds a project into a web session instead.

## Rebuilding it

```bash
./design-system/build.sh
```

`tokens.css` and `components.css` are the source of truth; `parts/*.html` are
body fragments; `dist/` is generated and should never be hand-edited.

Each card has to render standalone in Claude Design's Design System pane, so
the build inlines both stylesheets into every file rather than linking them.
That inlining is the only duplication in here, and it is the whole reason the
previews are generated instead of hand-written: the tokens have one home, and
re-running the script is how a change to them reaches all twelve cards.

The first line of every file in `dist/` is its `@dsCard` marker — that is what
the Design System pane builds its card index from, so it has to stay first.

## Layout

```
design-system/
├── tokens.css       LIGHT_COLORS, DARK_COLORS, spacing, radius, shape, type
├── components.css   the ui/ components, transcribed from their .styles.ts
├── parts/           one body fragment per card
├── dist/            generated — what /design-sync pushes
└── build.sh
```

Every card is drawn twice, light beside dark. Both schemes ship, and a
component that was only ever checked in one of them is a component that is
wrong in the other.

## What this is not

It is **not** a second source of truth. `frontend/src/theme/tokens/` is the
source of truth and stays that way; this is a transcription of it for a tool
that speaks CSS. When a token changes in TypeScript, change it here too and
re-run the build — nothing checks that automatically, and nothing should
generate the TypeScript from this.

It is also not a component library: these are pictures of components for a
design tool, not code anything imports. The direction is canvas → React Native,
by hand.

Two things are deliberately approximated, because CSS has no equivalent:

- **Glyphs** are geometric placeholders. The app uses MaterialCommunityIcons,
  picked from the icon set's own union so a misspelled name is a compile error.
- **Elevation** is a box-shadow standing in for React Native's `shadow*` plus
  Android `elevation`. Only the three surfaces that genuinely float carry one.
