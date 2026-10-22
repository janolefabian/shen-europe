import {
  getAutomaticHeroReference,
  type CategorizedInstrumentPhoto,
  type InstrumentPhotoCategory,
} from "./instrumentPhotos";
import type { ImageMetadata } from "astro";

type ImageModule = {
  default: ImageMetadata;
};

const imageModules = import.meta.glob<ImageModule>(
  "/src/content/instruments/**/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
  },
);

function filenameFromPath(path: string): string {
  return path.split("/").pop() ?? "";
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

function stripOrderPrefix(filename: string): string {
  return filename.replace(/^\d+[-_ ]*/, "");
}

function humanizeFilename(filename: string): string {
  return stripOrderPrefix(stripExtension(filename))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function imageOrder(path: string): number {
  const filename = filenameFromPath(path);
  const match = filename.match(/^(\d+)[-_ ]/);
  return match ? Number(match[1]) : 1000;
}

export interface InstrumentImage {
  src: string;
  alt: string;
  filename: string;
  metadata: ImageMetadata;
  category?: InstrumentPhotoCategory;
}

const photoLabels: Record<InstrumentPhotoCategory, string> = {
  "front-complete": "Full front view", "body-front": "Front view",
  "body-back": "Back view", "side-ribs": "Ribs", "side-ribs-front": "Front and ribs",
  "corner-detail": "Corner detail", "tuning-machines-detail": "Tuning machine detail",
  "scroll-detail": "Scroll detail",
};

export interface InstrumentImages {
  hero?: InstrumentImage;
  gallery: InstrumentImage[];
}

// Calibrated to these originals: align the neck/body junction and body bottom.
// Preserve proportions and original files; this is not a true-to-scale comparison.
export function getInstrumentPhotoCrop(inventory: string, image?: InstrumentImage) {
  if (image?.filename !== "hero.png" || image.metadata.width !== 2000 || image.metadata.height !== 3000) return undefined;
  if (inventory === "BASS-0003") return { x: 109, y: 241, width: 1752, height: 2628 };
  if (inventory === "BASS-0004") return { x: 83, y: 0, width: 1834, height: 2751 };
  return undefined;
}

export type InstrumentGalleryReference = CategorizedInstrumentPhoto;

export interface InstrumentImageReferences {
  hero?: string | null;
  gallery?: InstrumentGalleryReference[];
}

function instrumentFolder(source: string): string {
  return source
    .replace(/\\/g, "/")
    .replace(/^.*?src\/content\/instruments\//, "")
    .replace(/\/index(?:\.(?:md|mdx))?$/, "");
}

export function getInstrumentImages(
  source: string,
  title: string,
  references: InstrumentImageReferences = {},
): InstrumentImages {
  const folder = instrumentFolder(source);
  const folderPrefix = `/src/content/instruments/${folder}/`;

  const entries = Object.entries(imageModules)
    .filter(([path]) => path.startsWith(folderPrefix))
    .map(([path, module]) => ({
      path,
      src: module.default.src,
      metadata: module.default,
      filename: filenameFromPath(path),
    }));

  const entryByPath = new Map(entries.map((entry) => [entry.path, entry]));
  const resolveReference = (reference: string) => {
    const normalizedReference = reference.replace(/\\/g, "/").replace(/^\.\//, "");
    const path = normalizedReference.startsWith("src/content/instruments/")
      ? `/${normalizedReference}`
      : `${folderPrefix}${normalizedReference}`;

    // Older Keystatic entries can store gallery/0/image.png while the image
    // directory adds a second gallery segment. Prefer exact references first.
    return entryByPath.get(path) ?? (
      normalizedReference.startsWith("gallery/")
        ? entryByPath.get(`${folderPrefix}gallery/${normalizedReference}`)
        : undefined
    );
  };

  const galleryEntries =
    references.gallery && references.gallery.length > 0
      ? references.gallery
          .map(({ image, category }) => {
            const entry = resolveReference(image);
            return entry ? { ...entry, category } : undefined;
          })
          .filter((entry): entry is (typeof entries)[number] & { category: InstrumentPhotoCategory } => Boolean(entry))
      : entries
          .filter(({ filename }) => !/^hero\./i.test(filename))
          .sort((a, b) => {
            const orderDifference = imageOrder(a.path) - imageOrder(b.path);
            if (orderDifference !== 0) return orderDifference;
            return a.filename.localeCompare(b.filename, undefined, {
              numeric: true,
              sensitivity: "base",
            });
          });

  const automaticHeroReference = references.gallery
    ? getAutomaticHeroReference(references.gallery)
    : undefined;
  const heroEntry =
    (references.hero ? resolveReference(references.hero) : undefined) ??
    (automaticHeroReference
      ? resolveReference(automaticHeroReference.image)
      : undefined) ??
    entries.find(({ filename }) =>
      /^hero\.(jpg|jpeg|png|webp|avif)$/i.test(filename),
    );

  const toImage = (entry: (typeof entries)[number] & { category?: InstrumentPhotoCategory }): InstrumentImage => {
    const label = entry.category ? photoLabels[entry.category] : humanizeFilename(entry.filename);
    return {
      src: entry.src,
      filename: entry.filename,
      metadata: entry.metadata,
      category: entry.category,
      alt: label ? `${title}: ${label}` : title,
    };
  };

  const gallery = galleryEntries.map(toImage);
  const hero = heroEntry
    ? {
        ...toImage(heroEntry),
        alt: `${title}: front view`,
      }
    : gallery[0];

  return { hero, gallery };
}
