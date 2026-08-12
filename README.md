# Shen Europe

Static Astro website for presenting Samuel Shen double basses available through
Shen Europe.

## Requirements

- Node.js 22.12 or newer
- npm

Install dependencies once:

```sh
npm install
```

## Development

Start Astro in background mode:

```sh
npx astro dev --background
```

Useful server commands:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Create a production build:

```sh
npm run build
```

The static output is written to `dist/`.

## Managing instruments

Each instrument is one folder inside `src/content/instruments/`:

```text
src/content/instruments/
└── sb800-mirecourt-001/
    ├── index.md
    ├── hero.jpg
    ├── 01-front.jpg
    ├── 02-back.jpg
    └── 03-detail.jpg
```

To add an instrument:

1. Copy an existing instrument folder.
2. Give the folder a stable internal name. The folder name does not determine
   the public URL.
3. Edit the frontmatter and body in `index.md`.
4. Add `hero.jpg` for the main image.
5. Add gallery images with numeric prefixes to control their order.
6. Run `npm run build` before publishing.

The `slug` determines the public URL, for example:

```yaml
slug: "sb800-mirecourt"
```

becomes `/instruments/sb800-mirecourt/`.

Slugs must contain lowercase letters, numbers and single hyphens only. Both
`slug` and `inventory` must be unique across all instruments. The production
build fails with a descriptive error when either value is duplicated.

### Images

- `hero.jpg`, `hero.jpeg`, `hero.png`, `hero.webp` or `hero.avif` is used as the
  main image.
- All other supported images in the instrument folder appear in the gallery.
- Prefix gallery filenames with `01-`, `02-`, and so on to define their order.
- Use descriptive filenames such as `05-detail-bridge.jpg`; filenames are also
  used to generate accessible alternative text.
- If no explicit hero image exists, the first ordered gallery image is used.

### Availability

Supported status values are:

- `available`
- `reserved`
- `coming-soon`
- `sold`

Sold instruments keep their detail page but are omitted from the available
instruments page. The numeric `order` field controls listing order.

### Optional fields

Most specifications, price and YouTube video ID are optional. Leave a field out
instead of adding an empty value. For YouTube, store only the video ID rather
than the complete URL.

The Markdown below the frontmatter becomes the long-form description on the
instrument detail page.

## Project structure

```text
src/
├── components/          Reusable Astro components
├── content/instruments/ Instrument content and images
├── layouts/             Shared page layout
├── lib/                 Instrument and image helpers
├── pages/               File-based routes
└── styles/              Global styles
```
