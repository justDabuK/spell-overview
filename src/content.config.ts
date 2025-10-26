import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const scalingLevelDiceType = z.object({
  label: z.string(),
  scaling: z.object({
    "1": z.string().optional(),
    "2": z.string().optional(),
    "3": z.string().optional(),
    "4": z.string().optional(),
    "5": z.string().optional(),
    "6": z.string().optional(),
    "7": z.string().optional(),
    "8": z.string().optional(),
    "9": z.string().optional(),
    "10": z.string().optional(),
    "11": z.string().optional(),
    "12": z.string().optional(),
    "13": z.string().optional(),
    "14": z.string().optional(),
    "15": z.string().optional(),
    "16": z.string().optional(),
    "17": z.string().optional(),
    "18": z.string().optional(),
    "19": z.string().optional(),
    "20": z.string().optional(),
  }),
});

const entryListType = z.object({
  type: z.literal("list"), // list
  style: z.string().optional(),
  items: z.array(
    z.union([
      z.object({
        type: z.string(), // item
        name: z.string(),
        entries: z.array(z.string()),
      }),
      z.string(),
    ]),
  ),
});

const entryQuoteType = z.object({
  type: z.literal("quote"), // quote
  entries: z.array(z.string()),
  by: z.string(),
});

const entryInsetType = z.object({
  type: z.literal("inset"), // quote
  source: z.string(),
  page: z.number(),
  name: z.string(),
  entries: z.array(z.string()),
});

const entryTableType = z.object({
  type: z.literal("table"), // table
  caption: z.string().optional(),
  colLabels: z.array(z.string()),
  colStyles: z.array(z.string()),
  rows: z.array(
    z.array(
      z.union([
        z.string(),
        z.object({
          type: z.string(), // cell
          roll: z.union([
            z.object({
              exact: z.number(),
            }),
            z.object({
              min: z.number(),
              max: z.number(),
            }),
          ]),
        }),
      ]),
    ),
  ),
});

const spells = defineCollection({
  loader: glob({ pattern: "**/spells-*.json", base: "./src/data/spells" }),
  schema: z.object({
    spell: z.array(
      z.object({
        name: z.string(),
        source: z.string(),
        page: z.number().optional(),
        reprintedAs: z.array(z.string()).optional(),
        srd52: z.union([z.boolean(), z.string()]).optional(),
        basicRules2024: z.boolean().optional(),
        level: z.number(),
        school: z.string(),
        contaminated: z.boolean().optional(),
        time: z.array(
          z.object({
            number: z.number(),
            unit: z.string(),
          }),
        ),
        range: z.object({
          type: z.string(),
          distance: z
            .object({
              type: z.string(),
              amount: z.number().optional(),
            })
            .optional(),
        }),
        components: z.object({
          v: z.boolean().optional(),
          s: z.boolean().optional(),
          m: z
            .union([
              z.string(),
              z.object({
                text: z.string(),
                cost: z.number().optional(),
                consume: z.union([z.boolean(), z.string()]).optional(),
              }),
            ])
            .optional(),
        }),
        duration: z.array(
          z.discriminatedUnion("type", [
            z.object({
              type: z.literal("instant"), // instant
              concentration: z.boolean().optional(),
            }),
            z.object({
              type: z.literal("timed"), // timed
              duration: z
                .object({
                  type: z.string(),
                  amount: z.number(),
                })
                .optional(),
              concentration: z.boolean().optional(),
            }),
            z.object({
              type: z.literal("permanent"), // permanent
              ends: z.array(z.string()),
              concentration: z.boolean().optional(),
            }),
            z.object({
              type: z.literal("special"),
            }),
          ]),
        ),
        meta: z
          .object({
            ritual: z.boolean().optional(),
          })
          .optional(),
        entries: z.array(
          z.union([
            z.string(),
            entryListType,
            entryQuoteType,
            z.object({
              type: z.literal("entries"), // entries
              name: z.string(),
              entries: z.array(z.union([z.string(), entryListType])),
            }),
            entryTableType,
            entryInsetType,
          ]),
        ),
        entriesHigherLevel: z
          .array(
            z.object({
              type: z.literal("entries"), // entries
              name: z.string(),
              entries: z.array(z.string()),
            }),
          )
          .optional(),
        scalingLevelDice: z
          .union([scalingLevelDiceType, z.array(scalingLevelDiceType)])
          .optional(),
        damageInflict: z.array(z.string()).optional(),
        damageResist: z.array(z.string()).optional(),
        conditionImmune: z.array(z.string()).optional(),
        conditionInflict: z.array(z.string()).optional(),
        spellAttack: z.array(z.string()).optional(),
        savingThrow: z.array(z.string()).optional(),
        affectsCreatureType: z.array(z.string()).optional(),
        miscTags: z.array(z.string()).optional(),
        areaTags: z.array(z.string()).optional(),
        hasFluffImages: z.boolean().optional(),
      }),
    ),
  }),
});

export const collections = { spells };
