type ImageModule = {
  default: string;
};

const imageModules = import.meta.glob<ImageModule>(
  "/src/content/instruments/**/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?url",
  },
);

function imageUrl(module: ImageModule | string): string {
  if (typeof module === "string") return module;
  return module.default;
}

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
}

export interface InstrumentImages {
  hero?: InstrumentImage;
  gallery: InstrumentImage[];
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
): InstrumentImages {
  const folder = instrumentFolder(source);
  const folderPrefix = `/src/content/instruments/${folder}/`;

  const entries = Object.entries(imageModules)
    .filter(([path]) => path.startsWith(folderPrefix))
    .map(([path, module]) => ({
      path,
      src: imageUrl(module),
      filename: filenameFromPath(path),
    }));

  const heroEntry = entries.find(({ filename }) =>
    /^hero\.(jpg|jpeg|png|webp|avif)$/i.test(filename),
  );

  const galleryEntries = entries
    .filter(({ filename }) => !/^hero\./i.test(filename))
    .sort((a, b) => {
      const orderDifference = imageOrder(a.path) - imageOrder(b.path);
      if (orderDifference !== 0) return orderDifference;
      return a.filename.localeCompare(b.filename, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

  const toImage = (entry: (typeof entries)[number]): InstrumentImage => {
    const label = humanizeFilename(entry.filename);
    return {
      src: entry.src,
      filename: entry.filename,
      alt: label ? `${title} – ${label}` : title,
    };
  };

  const gallery = galleryEntries.map(toImage);
  const hero = heroEntry
    ? {
        src: heroEntry.src,
        filename: heroEntry.filename,
        alt: `${title} – instrument view`,
      }
    : gallery[0];

  return { hero, gallery };
}
