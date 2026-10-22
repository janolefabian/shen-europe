# Shen Europe

Static Astro website for presenting Samuel Shen double basses.

## Project rules

- Use Shen Europe as the editorial identity, without founder stories or
  cross-company branding. Fitted components may be named factually.
- Prefer precise information, restrained typography and natural wood colours
  over promotional language. Keep body text comfortably readable.
- Lead with available instruments and appointments to try them; keep the model
  guide and specialist-dealer contact accessible. No public prices or checkout.
- Keep availability states separate. Only available instruments may be offered
  as ready to try; selected sold instruments are clearly labelled references.
- Publish only verified instrument, construction and service information.
  Separate individual observations from model-reference specifications. Do not
  imply a guaranteed sound ranking from model numbers.
- Preserve instrument proportions and original photographs. No generative
  retouching, fabricated parts or substitute photographs of another model.
- Keep noindex enabled unless explicitly instructed otherwise. Noindex is not
  access control. Pushes and deployments require separate user authorisation.
- Keep private discussions, business planning and confidential working notes
  outside version control, even when the GitHub repository is private.

## Local-only material

Use `private-notes/` for internal notes and `design-studies/` for local visual
experiments. Both root directories are excluded by the versioned `.gitignore`.
Never force-add them or place their contents in public assets, content files,
tests or commit messages. An ignore rule does not remove previously committed
material from Git history.

Local notes are not backed up by a push. Keep a separate local backup; Git
bundles used for local recovery must not be added to the repository or exposed
as backup branches or tags.

## Model guide and photography

The model guide groups the existing catalogue by construction, with one
explanation per group. Only confirmed model combinations belong in the
catalogue. Do not reintroduce SB-190, SB-288 or the unverified Mahogany variant.

- `src/lib/instrumentTaxonomy.ts` defines the catalogue.
- `src/lib/modelPresentation.ts` maps catalogue entries to illustrations and
  public model-reference URLs.
- `src/lib/modelOutlines.ts` contains the source-based, smoothed body contours.
- `ModelOutline.astro` compares body shapes at equal height without stretching
  their proportions. These are schematic outlines, not measured plans or
  actual-size comparisons.
- Available examples link to the individual instrument pages using text links.

Instrument photographs use responsive WebP derivatives and reserved dimensions.
Above-fold images load eagerly; gallery images load lazily. The homepage front
views are visually aligned, not shown at a measured common scale.

About uses `stacked-bodies.png`, `workshop-bodies.png` and
`basses-before-varnishing.png` from `src/assets/suzhou/`. Preserve the supplied
source files unchanged; Astro only encodes responsive derivatives.
`provenance.json` records source filenames and checksums without personal
filesystem paths. The archived `varnished-basses.png` is not displayed.

## Verification

```sh
npm run build
node --experimental-strip-types --test tests/instrument-availability.test.ts tests/model-guide.test.ts tests/public-build.test.mjs
git diff --check
```

Tests cover availability grouping, homepage selection, contact contexts,
noindex, model mappings, image provenance and internal links/assets. Also check
desktop and narrow layouts, the menu, image loading and actual enquiry paths.

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
- `unavailable`
- `sold`

Sold instruments keep their detail page in the separate Selected past instruments
section. Available, on-the-way and reserved entries have their own sections.
Not-available entries retain their detail pages but are omitted from public
stock and archive lists. Fully carved instruments are ordered before hybrids
and laminated models; `order` sorts entries within the same priority.
Home features up to two available instruments, prioritising SB-1000, then SB-800.
The local admin and Keystatic both support the not-available status.

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
