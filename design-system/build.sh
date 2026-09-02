#!/usr/bin/env bash
#
# Composes design-system/dist/ from tokens.css, components.css and parts/.
#
# Every card has to render standalone in Claude Design's Design System pane, so
# the two stylesheets are inlined into each one rather than linked. That is the
# only duplication here, and it is why the previews are generated rather than
# hand-written: the tokens have one home, and re-running this is how a change
# to them reaches all twelve cards.
#
# Usage: ./design-system/build.sh
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
dist="$root/dist"
fonts="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Schibsted+Grotesk:wght@400;500;600&display=swap"

rm -rf "$dist"
mkdir -p "$dist"

for part in "$root"/parts/*.html; do
  name="$(basename "$part")"
  out="$dist/$name"

  # The two header comments are found by content rather than by line number:
  # Prettier owns the formatting of parts/, and a build that broke the moment
  # it reflowed a comment would be a build nobody trusts. Everything that is
  # not a header line is the body.
  card="$(grep -m1 -- '@dsCard' "$part")"
  title="$(grep -m1 -- '<!-- title:' "$part" | sed -e 's/^[[:space:]]*<!-- title:[[:space:]]*//' -e 's/[[:space:]]*-->$//')"

  if [ -z "$card" ] || [ -z "$title" ]; then
    printf 'error: %s is missing an @dsCard or a title comment\n' "$name" >&2
    exit 1
  fi

  {
    printf '%s\n' "$card"
    printf '<!doctype html>\n<html lang="sk">\n<head>\n'
    printf '<meta charset="utf-8" />\n'
    printf '<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
    printf '<title>%s</title>\n' "$title"
    printf '<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
    printf '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
    printf '<link rel="stylesheet" href="%s" />\n' "$fonts"
    printf '<style>\n'
    cat "$root/tokens.css"
    cat "$root/components.css"
    printf '</style>\n</head>\n<body>\n'
    grep -v -e '@dsCard' -e '<!-- title:' "$part"
    printf '</body>\n</html>\n'
  } > "$out"

  printf 'built %s\n' "dist/$name"
done

printf '\n%s cards in %s\n' "$(find "$dist" -name '*.html' | wc -l | tr -d ' ')" "$dist"
