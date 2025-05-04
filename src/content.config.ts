import {defineCollection, z} from "astro:content";
import {glob} from "astro/loaders";

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
    })
})

const entryListType = z.object({
    type: z.string(), // list
    style: z.string().optional(),
    items: z.array(z.union([
        z.object({
            type: z.string(), // item
            name: z.string(),
            entries: z.array(z.string()),
        }),
        z.string()
    ]))
})

const spells = defineCollection({
    loader: glob({ pattern: ["**/spells-xphb.json", "**/spells-scc.json"], base: "./src/data/spells"}),
    schema: z.object({
        spell: z.array(z.object({
            name: z.string(),
            source: z.string(),
            page: z.number(),
            srd52: z.union([z.boolean(), z.string()]).optional(),
            basicRules2024: z.boolean().optional(),
            level: z.number(),
            school: z.string(),
            time: z.array(z.object({
                number: z.number(),
                unit: z.string(),
            })),
            range: z.object({
                type: z.string(),
                distance: z.object({
                    type: z.string(),
                    amount: z.number().optional(),
                })
            }),
            components: z.object({
                v: z.boolean().optional(),
                s: z.boolean().optional(),
                m: z.union([
                    z.string(),
                    z.object({
                        text: z.string(),
                        cost: z.number().optional(),
                        consume: z.boolean().optional(),
                    })
                ]).optional(),
            }),
            duration: z.array(z.union([
                z.object({
                    type: z.string(), // instant
                    concentration: z.boolean().optional(),
                }),
                z.object({
                    type: z.string(), // timed
                    duration: z.object({
                        type: z.string(),
                        amount: z.number(),
                    }).optional(),
                    concentration: z.boolean().optional(),
                }),
                z.object({
                    type: z.string(), // permanent
                    ends: z.array(z.string()),
                    concentration: z.boolean().optional(),

                })
            ])
            ),
            meta: z.object({
                ritual: z.boolean().optional(),
            }).optional(),
            entries: z.array(z.union([
                z.string(),
                entryListType,
                z.object({
                    type: z.string(), // entries
                    name: z.string(),
                    entries: z.array(z.union([
                        z.string(),
                        entryListType
                        ]))
                }),
                z.object({
                    type: z.string(), // table
                    caption: z.string().optional(),
                    colStyles: z.array(z.string()),
                    colLabels: z.array(z.string()),
                    rows: z.array(z.array(z.string()))
                })
            ])),
            entriesHigherLevel: z.array(z.object({
                type: z.string(), // entries
                name: z.string(),
                entries: z.array(z.string()),
            })).optional(),
            scalingLevelDice: z.union([
                scalingLevelDiceType,
                z.array(scalingLevelDiceType)
            ]).optional(),
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
        }))
    })
});

export const collections = {spells}