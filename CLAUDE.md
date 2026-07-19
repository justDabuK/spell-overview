# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static [Astro](https://astro.build) site that renders printable D&D 5e spell-card overviews, one page per character. Spell/item data follows the [5etools](https://github.com/5etools-mirror-3/5etools-src) JSON format.

## Commands

This project uses **pnpm** (via corepack). There is no test suite and no linter — formatting is the only check.

```shell
corepack enable && pnpm install   # first-time setup
pnpm dev                          # dev server (use to verify a character's spells resolve)
pnpm build                        # production build to dist/
pnpm preview                      # serve the build
pnpm format                       # prettier --write . (prettier-plugin-astro)
```

## Architecture

**Data flow:** JSON spell files in `src/data/spells/spells-*.json` are loaded as an Astro content collection (`getCollection("spells")`). The collection and its Zod schema are defined in `src/content.config.ts`; the schema mirrors the 5etools spell/item shape, so when adding fields, match 5etools' field names and conventions. A second `items` collection exists for `src/data/items/items.json`.

**The `5etools-src/` git submodule** is the upstream source for that data format and the raw spell/item JSON — it is the reference when extending schemas or importing new spells. It is excluded from prettier (`.prettierignore`).

**Character pages** (`src/pages/characters/*.astro`) are the main content. Each page is a thin wrapper: it declares an array of spell _names_ and passes it to `SpellCardLayout`. The layout (`src/layouts/SpellCardLayout.astro`) does the real work:

- looks spells up by name across all collection files,
- filters out any spell that has `reprintedAs` (so reprints don't duplicate),
- sorts by level → casting-time (action/bonus/reaction/minute/hour/day) → name, grouped into per-level rows,
- renders a `(found/requested)` count and lists any unresolved names when the lists don't match — this is the signal that a name is misspelled or its source file is missing.

**Rendering 5etools markup:** spell entry text contains 5etools tags like `{@damage 1d6}`, `{@condition prone}`, `{@spell fireball}`. `src/components/highlightSpecialParts.ts` rewrites these to HTML via regex. New tag types appearing in spell data need a new replacement rule here. The `SpellDescription/` components handle the structured (non-string) entry types — `entries`, `list`, `table`, `inset`.

**Styling:** global design tokens (sizes, Catppuccin colors with `light-dark()`) live in `BaseLayout.astro`. There is a `@media print` layout in `SpellCardLayout.astro` since these cards are meant to be printed.

## Adding a character

Copy `src/pages/characters/fjord-starbeard.astro`, rename it, edit the spell-name array and `characterName`. Start the dev server and open the page; if the header shows a `found/requested` mismatch, fix the listed names. (`all-*.astro` pages render every spell from one source file.)
