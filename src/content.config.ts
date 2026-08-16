import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const instrumentPhotoCategory = z.enum([
  "front-complete",
  "corner-detail",
  "tuning-machines-detail",
  "scroll-detail",
  "body-front",
  "body-back",
  "side-ribs",
  "side-ribs-front",
]);

const publicSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const instruments = defineCollection({
  loader: glob({
    base: "./src/content/instruments",
    pattern: "**/index.md",
  }),

  schema: z.object({
    title: z.string().trim().min(1),
    publication: z.enum(["draft", "published"]).default("draft"),
    slug: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || publicSlugPattern.test(value),
        "Use lowercase letters, numbers and single hyphens only.",
      )
      .default(""),
    inventory: z.string().trim().default(""),

    model: z.string().default(""),
    outline: z.string().default(""),
    size: z.string().optional(),
    year: z.number().int().nullable().optional(),

    status: z.enum(["available", "reserved", "coming-soon", "sold"]),
    condition: z.enum(["new", "demonstrator", "pre-owned"]).optional(),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),

    location: z.string().default("Berlin"),

    shortDescription: z.string().default(""),

    hero: z.string().nullable().optional(),
    gallery: z
      .array(
        z.object({
          image: z.string(),
          category: instrumentPhotoCategory,
        }),
      )
      .default([]),

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
    tailpiece: z.string().optional(),

    endpin: z.string().optional(),
    warranty: z.string().optional(),
  }),
});

export const collections = { instruments };
