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

## Local instrument admin

The project includes a local-only content editor powered by Keystatic. It writes
directly to the Markdown files and images in this repository. There is no login,
cloud database or public admin route.

Start the editor:

```sh
npm run admin
```

Open the local URL printed by Astro and add `/keystatic`, for example:

```text
http://127.0.0.1:4321/keystatic
```

The port may be different when another local server is already running.

Useful commands:

```sh
npm run admin:status
npm run admin:logs
npm run admin:stop
```

To add an instrument in the editor:

1. Open **Instruments** and choose **Add**. Alternatively, open a similar
   instrument and use **Duplicate entry**.
2. Enter the public title and a stable internal content-folder name.
3. Enter a unique public URL slug and inventory number.
4. Complete status, condition, specifications and description.
5. Upload one hero image and the gallery images.
6. Drag gallery entries into the desired display order.
7. Choose **Create** or **Save**.
8. Check the public page locally and run `npm run build` before publishing.

Changes are saved immediately to `src/content/instruments/`. Review and commit
these files with Git just like other project changes. The Keystatic integration
is disabled during production builds, so `/keystatic` is never included in
`dist/`.

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

The optional `condition` field accepts `new`, `demonstrator` or `pre-owned`.
Use the optional `strings` and `bridge` fields for the setup currently fitted
to the individual instrument.

### Optional fields

Most specifications and the YouTube video ID are optional. Leave a field out
instead of adding an empty value. Public instrument entries deliberately do not
contain pricing; prices are provided on request. For YouTube, store only the
video ID rather than the complete URL.

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
