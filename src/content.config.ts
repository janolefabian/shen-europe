import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const instruments = defineCollection({
  loader: glob({
    base: "./src/content/instruments",
    pattern: "**/index.md",
  }),

  schema: z.object({
    title: z.string().trim().min(1),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and single hyphens only.",
      ),
    inventory: z.string().trim().min(1),

    model: z.string(),
    outline: z.string(),
    size: z.string().optional(),
    year: z.number().int().nullable().optional(),

    status: z.enum(["available", "reserved", "coming-soon", "sold"]),
    condition: z.enum(["new", "demonstrator", "pre-owned"]).optional(),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),

    location: z.string().default("Berlin"),

    shortDescription: z.string(),

    hero: z.string().nullable().optional(),
    gallery: z.array(z.string()).default([]),

    youtubeVideoId: z.string().optional(),

    stringLength: z.string().optional(),
    bodyLength: z.string().optional(),
    weight: z.string().optional(),

    topMaterial: z.string().optional(),
    backMaterial: z.string().optional(),
    ribs: z.string().optional(),
    purfling: z.string().optional(),
    varnish: z.string().optional(),

    neck: z.string().optional(),
    fingerboard: z.string().optional(),
    tuningMachines: z.string().optional(),
    strings: z.string().optional(),
    bridge: z.string().optional(),

    endpin: z.string().optional(),
    warranty: z.string().optional(),
  }),
});

export const collections = { instruments };
