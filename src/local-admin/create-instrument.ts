import type { APIRoute } from "astro";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import {
  bassQualityValues,
  isBassModelAvailableForQuality,
} from "../lib/instrumentTaxonomy";
import { instrumentPhotoCategoryValues } from "../lib/instrumentPhotos";

export const prerender = false;

const instrumentDirectory = resolve(
  process.cwd(),
  "src/content/instruments",
);
const inventoryCounterFile = resolve(
  process.cwd(),
  "src/data/inventory-counters.json",
);
const inventoryPrefix = "BASS";

const validCategories = new Set<string>(instrumentPhotoCategoryValues);
const validQualityLevels = new Set<string>(bassQualityValues);
const maximumFileCount = 40;
const maximumFileSize = 40 * 1024 * 1024;

const supportedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function folderSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function availableFolderName(base: string): Promise<string> {
  let candidate = base;
  let suffix = 2;

  while (await pathExists(join(instrumentDirectory, candidate))) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function highestExistingInventoryNumber(): Promise<number> {
  try {
    const entries = await readdir(instrumentDirectory, { withFileTypes: true });
    let highest = 0;

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

      try {
        const content = await readFile(
          join(instrumentDirectory, entry.name, "index.md"),
          "utf8",
        );
        const match = content.match(/^inventory:\s*["']?BASS-(\d+)["']?\s*$/m);

        if (match) highest = Math.max(highest, Number(match[1]));
      } catch {
        // Ignore unrelated folders without a readable instrument entry.
      }
    }

    return highest;
  } catch {
    return 0;
  }
}

async function nextInventoryId(): Promise<string> {
  let counters: Record<string, number> = {};

  try {
    counters = JSON.parse(await readFile(inventoryCounterFile, "utf8"));
  } catch {
    // The counter is reconstructed from existing content below.
  }

  const persisted = Number(counters[inventoryPrefix]) || 0;
  const existing = await highestExistingInventoryNumber();
  const next = Math.max(persisted, existing) + 1;

  counters[inventoryPrefix] = next;
  await mkdir(dirname(inventoryCounterFile), { recursive: true });
  await writeFile(
    inventoryCounterFile,
    `${JSON.stringify(counters, null, 2)}\n`,
    "utf8",
  );

  return `${inventoryPrefix}-${String(next).padStart(4, "0")}`;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function imageFilename(
  index: number,
  category: string,
  extension: string,
  categoryCounts: Map<string, number>,
): string {
  const count = (categoryCounts.get(category) ?? 0) + 1;
  categoryCounts.set(category, count);
  const duplicateSuffix = count > 1 ? `-${count}` : "";

  return `${String(index + 1).padStart(2, "0")}-${category}${duplicateSuffix}.${extension}`;
}

export const POST = (async ({ request }) => {
  const requestOrigin = new URL(request.url).origin;
  const submittedOrigin = request.headers.get("origin");

  if (submittedOrigin && submittedOrigin !== requestOrigin) {
    return json({ error: "Cross-origin requests are not allowed." }, 403);
  }

  const formData = await request.formData();
  const qualityLevel = String(formData.get("quality") ?? "").trim();
  const instrumentModel = String(formData.get("model") ?? "").trim();
  const photos = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File);
  const categories = formData
    .getAll("categories")
    .map((value) => String(value));

  if (!validQualityLevels.has(qualityLevel)) {
    return json({ error: "Bitte eine gültige Qualitätsstufe auswählen." }, 400);
  }

  if (!isBassModelAvailableForQuality(instrumentModel, qualityLevel)) {
    return json(
      { error: "Dieses Modell ist für die gewählte Qualitätsstufe nicht hinterlegt." },
      400,
    );
  }

  if (photos.length === 0) {
    return json({ error: "Bitte mindestens ein Foto auswählen." }, 400);
  }

  if (photos.length > maximumFileCount) {
    return json(
      { error: `Maximal ${maximumFileCount} Fotos pro Entwurf.` },
      400,
    );
  }

  if (
    categories.length !== photos.length ||
    categories.some((category) => !validCategories.has(category))
  ) {
    return json({ error: "Die Fotokategorien sind unvollständig." }, 400);
  }

  for (const photo of photos) {
    if (!supportedImageTypes.has(photo.type)) {
      return json(
        {
          error: `„${photo.name}“ wird nicht unterstützt. Bitte JPG, PNG, WebP oder AVIF verwenden.`,
        },
        400,
      );
    }

    if (photo.size > maximumFileSize) {
      return json(
        { error: `„${photo.name}“ ist größer als 40 MB.` },
        400,
      );
    }
  }

  await mkdir(instrumentDirectory, { recursive: true });
  const inventory = await nextInventoryId();
  const title = `${qualityLevel} · ${instrumentModel}`;
  const publicSlug = folderSlug(
    `${qualityLevel}-${instrumentModel}-${inventory}`,
  );
  const folderName = await availableFolderName(folderSlug(inventory));
  const destination = join(instrumentDirectory, folderName);
  const temporaryDirectory = await mkdtemp(
    join(instrumentDirectory, ".instrument-intake-"),
  );

  try {
    const categoryCounts = new Map<string, number>();
    const gallery: Array<{ image: string; category: string }> = [];

    for (const [index, photo] of photos.entries()) {
      const category = categories[index];
      const extension = supportedImageTypes.get(photo.type)!;
      const filename = imageFilename(
        index,
        category,
        extension,
        categoryCounts,
      );

      await writeFile(
        join(temporaryDirectory, filename),
        Buffer.from(await photo.arrayBuffer()),
      );
      gallery.push({ image: filename, category });
    }

    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      'publication: "draft"',
      `slug: ${yamlString(publicSlug)}`,
      `inventory: ${yamlString(inventory)}`,
      `model: ${yamlString(qualityLevel)}`,
      `outline: ${yamlString(instrumentModel)}`,
      'status: "available"',
      'condition: "new"',
      "order: 100",
      "featured: false",
      'location: "Berlin"',
      "gallery:",
      ...gallery.flatMap(({ image, category }) => [
        `  - image: ${yamlString(image)}`,
        `    category: ${yamlString(category)}`,
      ]),
      "---",
      "",
    ].join("\n");

    await writeFile(join(temporaryDirectory, "index.md"), frontmatter, "utf8");
    await rename(temporaryDirectory, destination);
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    console.error(error);
    return json(
      { error: "Der Entwurf konnte nicht gespeichert werden." },
      500,
    );
  }

  return json({
    inventory,
    publicSlug,
    folderName,
    photoCount: photos.length,
    editUrl: `/keystatic/collection/instruments/item/${encodeURIComponent(folderName)}`,
  });
}) satisfies APIRoute;
