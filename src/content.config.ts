import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

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
        type: z.literal("item"), // item
        name: z.string(),
        entries: z.array(z.string()),
      }),
      z.string(),
    ]),
  ),
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

const entryEntriesType = z.object({
  type: z.literal("entries"), // entries
  name: z.string(),
  entries: z.array(z.union([z.string(), entryListType])),
});

const entryList = z.array(
  z.union([
    z.string(),
    z.discriminatedUnion("type", [
      entryListType,
      entryEntriesType,
      entryTableType,
      entryInsetType,
    ]),
  ]),
);

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
        entries: entryList,
        entriesHigherLevel: z
          .array(
            z.object({
              type: z.literal("entries"), // entries
              name: z.string(),
              entries: z.array(z.union([z.string(), entryTableType])),
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

const alternativeMovement = z.enum(["fly", "climb", "swim", "burrow", "walk"]);

const items = defineCollection({
  loader: glob({ pattern: "items.json", base: "./src/data/items" }),
  schema: z.object({
    _meta: z.record(z.string(), z.unknown()),
    itemGroup: z.unknown(),
    item: z.array(
      z.object({
        name: z.string(),
        group: z.array(z.string()).optional(),
        source: z.string(),
        page: z.number().optional(),
        baseItem: z.string().optional(),
        type: z.string().optional(),
        scfType: z.string().optional(),
        rarity: z
          .enum([
            "unknown",
            "unknown (magic)",
            "varies",
            "none",
            "common",
            "uncommon",
            "rare",
            "very rare",
            "legendary",
            "artifact",
          ])
          .optional(),
        reqAttune: z.union([z.string(), z.boolean()]).optional(),
        reqAttuneTags: z
          .array(
            z.object({
              class: z.string().optional(),
              spellcasting: z.boolean().optional(),
            }),
          )
          .optional(),
        wondrous: z.boolean().optional(),
        modifySpeed: z
          .object({
            equal: z
              .record(alternativeMovement, z.literal("walk").optional())
              .optional(),
            multiply: z
              .record(alternativeMovement, z.number().optional())
              .optional(),
            static: z
              .record(alternativeMovement, z.number().optional())
              .optional(),
            bonus: z.object({ "*": z.number() }).optional(),
          })
          .optional(),
        weight: z.number().optional(),
        value: z.union([z.number(), z.null()]).optional(),
        age: z.string().optional(),
        weaponCategory: z.enum(["simple", "martial"]).optional(),
        property: z
          .array(
            z.enum([
              "L", // light
              "L|XPHB",
              "H", // heavy
              "H|XPHB",
              "2H", // two-handed
              "2H|XPHB",
              "V", // versatile
              "V|XPHB",
              "T", // thrown
              "T|XPHB",
              "F", // finesse
              "F|XPHB",
              "R", // reach
              "R|XPHB",
              "A", // ammunition
              "A|XPHB",
              "Vst|EGW", // Vestige of Divergence
            ]),
          )
          .optional(),
        range: z.string().optional(),
        dmg1: z.string().optional(),
        dmgType: z.enum(["S", "P", "B", "O", "R", "Y", "N", "C"]).optional(),
        dmg2: z.string().optional(),
        recharge: z
          .enum(["dawn", "special", "midnight", "dusk", "restLong"])
          .optional(),
        rechargeAmount: z.union([z.string(), z.number()]).optional(),
        staff: z.boolean().optional(),
        bonusWeapon: z.string().optional(),
        critThreshold: z.number().optional(),
        bonusSpellAttack: z.string().optional(),
        bonusSpellSaveDc: z.string().optional(),
        focus: z.union([z.array(z.string()), z.boolean()]).optional(),
        referenceSources: z.array(z.string()).optional(),
        reprintedAs: z.array(z.union([z.string(), z.unknown()])).optional(),
        srd52: z.union([z.boolean(), z.string()]).optional(),
        srd: z.union([z.boolean(), z.string()]).optional(),
        basicRules2024: z.boolean().optional(),
        basicRules: z.boolean().optional(),
        charges: z.union([z.number(), z.string()]).optional(),
        entries: z
          .array(
            z.union([
              z.string(),
              z.discriminatedUnion("type", [
                entryListType,
                entryEntriesType,
                entryTableType,
                entryInsetType,
              ]),
              z.unknown(),
            ]),
          )
          .optional(),
        light: z
          .array(
            z.object({
              bright: z.number().optional(),
              dim: z.number().optional(),
              shape: z.string().optional(),
            }),
          )
          .optional(),
        lootTables: z.array(z.string()).optional(),
        ammoType: z.string().optional(),
        attachedSpells: z
          .union([
            z.object({
              daily: z.record(z.string(), z.array(z.string())).optional(),
              charges: z.record(z.string(), z.array(z.string())).optional(),
              limited: z.record(z.string(), z.array(z.string())).optional(),
              other: z.array(z.string()).optional(),
              will: z.array(z.string()).optional(),
            }),
            z.array(z.string()),
          ])
          .optional(),
        miscTags: z.array(z.string()).optional(),
        hasFluffImages: z.boolean().optional(),
      }),
    ),
  }),
});

export const collections = { spells, items };
