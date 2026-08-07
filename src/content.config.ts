import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const galleryImage = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const instruments = defineCollection({
  loader: glob({
    base: "./src/content/instruments",
    pattern: "**/*.{md,mdx}",
  }),

  schema: z.object({
    title: z.string(),
    model: z.string(),
    outline: z.string(),

    size: z.string().optional(),
    year: z.number().int().optional(),

    status: z.enum(["available", "reserved", "coming-soon", "sold"]),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),

    price: z.string().optional(),
    location: z.string().default("Berlin"),

    shortDescription: z.string(),

    heroImage: z.string(),
    heroImageAlt: z.string(),

    gallery: z.array(galleryImage).default([]),

    // Store only the ID, e.g. "abc123XYZ", not the whole YouTube URL.
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

    endpin: z.string().optional(),
    warranty: z.string().optional(),
  }),
});

export const collections = {
  instruments,
};
