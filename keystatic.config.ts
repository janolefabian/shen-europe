import { collection, config, fields } from "@keystatic/core";
import { createElement } from "react";
import {
  bassModelOptions,
  bassQualityOptions,
} from "./src/lib/instrumentTaxonomy";
import {
  instrumentPhotoCategoryLabels,
  instrumentPhotoCategoryOptions,
} from "./src/lib/instrumentPhotos";

const optionalText = (label: string, description?: string) =>
  fields.text({ label, description });

const AdminHomeLink = () =>
  createElement(
    "a",
    {
      href: "/admin",
      title: "Zur Admin-Übersicht",
      style: {
        alignItems: "center",
        border: "1px solid currentColor",
        borderRadius: "3px",
        display: "inline-flex",
        fontSize: "10px",
        fontWeight: 700,
        height: "22px",
        letterSpacing: "0.06em",
        padding: "0 6px",
        textDecoration: "none",
        textTransform: "uppercase",
      },
    },
    "Admin",
  );

export default config({
  storage: { kind: "local" },

  ui: {
    brand: { name: "Shen Europe", mark: AdminHomeLink },
    navigation: { Content: ["instruments"] },
  },

  collections: {
    instruments: collection({
      label: "Instruments",
      path: "src/content/instruments/*/",
      slugField: "title",
      entryLayout: "form",
      columns: ["publication", "title", "slug", "model", "status"],
      format: { data: "yaml", contentField: "content" },

      schema: {
        title: fields.slug({
          name: {
            label: "Anzeigename",
            description:
              "Wird bei der Schnellerfassung automatisch aus Qualitätsstufe und Modell erzeugt. Die interne ID erscheint bewusst nicht im öffentlichen Titel.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Interner Datensatz",
            description:
              "Bei der Schnellerfassung basiert er auf der internen ID. Danach möglichst nicht mehr ändern.",
          },
        }),

        publication: fields.select({
          label: "Veröffentlichung",
          description:
            "Entwürfe bleiben vollständig unsichtbar. Öffentlich werden nur vollständige Einträge mit Front- oder Korpusfoto angezeigt.",
          defaultValue: "draft",
          options: [
            { label: "Entwurf", value: "draft" },
            { label: "Öffentlich", value: "published" },
          ],
        }),

        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Bild",
              validation: { isRequired: true },
            }),
            category: fields.select({
              label: "Kategorie",
              options: instrumentPhotoCategoryOptions,
              defaultValue: "body-front",
            }),
          }),
          {
            label: "Fotos – Schnellerfassung",
            description:
              "Für einen Entwurf reicht ein Foto. Vor der Veröffentlichung ist mindestens „Front – komplett“ oder „Korpus – Front“ erforderlich.",
            itemLabel: (props) => {
              const category = props.fields.category.value;
              const filename = props.fields.image.value?.filename;
              const label = instrumentPhotoCategoryLabels[category];

              return filename ? `${label} · ${filename}` : label;
            },
          },
        ),

        hero: fields.image({
          label: "Optionales Titelbild",
          description:
            "Kann leer bleiben. Automatische Reihenfolge: „Front – komplett“, „Korpus – Front“, danach die sinnvollste vorhandene Ansicht.",
        }),

        slug: fields.text({
          label: "Öffentlicher URL-Pfad",
          description:
            "Wird bei der Schnellerfassung automatisch aus Qualitätsstufe, Modell und ID erzeugt. Vor der Veröffentlichung bei Bedarf anpassen; danach stabil lassen.",
          validation: {
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Use lowercase letters, numbers and single hyphens only.",
            },
          },
        }),
        inventory: optionalText(
          "Interne ID",
          "Wird bei der Schnellerfassung automatisch vergeben und danach nicht mehr geändert.",
        ),

        model: fields.select({
          label: "Qualitätsstufe / Baureihe",
          defaultValue: "",
          options: [
            { label: "Noch nicht festgelegt", value: "" },
            ...bassQualityOptions,
          ],
        }),
        outline: fields.select({
          label: "Modell / Form",
          defaultValue: "",
          options: [
            { label: "Noch nicht festgelegt", value: "" },
            ...bassModelOptions,
          ],
        }),
        size: optionalText("Size", "For example 3/4."),
        year: fields.integer({ label: "Year" }),

        status: fields.select({
          label: "Availability",
          defaultValue: "available",
          options: [
            { label: "Available", value: "available" },
            { label: "Reserved", value: "reserved" },
            { label: "Coming soon", value: "coming-soon" },
            { label: "Sold", value: "sold" },
          ],
        }),
        condition: fields.select({
          label: "Condition",
          defaultValue: "new",
          options: [
            { label: "New", value: "new" },
            { label: "Demonstrator", value: "demonstrator" },
            { label: "Pre-owned", value: "pre-owned" },
          ],
        }),
        order: fields.integer({
          label: "Listing order",
          defaultValue: 100,
          validation: { isRequired: true, min: 0 },
        }),
        featured: fields.checkbox({
          label: "Feature on homepage",
          defaultValue: false,
        }),

        location: fields.text({
          label: "Location",
          defaultValue: "Berlin",
          validation: { isRequired: true },
        }),
        shortDescription: fields.text({
          label: "Short description",
          description:
            "Shown on cards and at the top of the detail page. Erst vor der Veröffentlichung nötig.",
          multiline: true,
        }),

        youtubeVideoId: optionalText(
          "YouTube video ID",
          "Enter only the video ID, not the full URL.",
        ),

        stringLength: optionalText("String length"),
        bodyLength: optionalText("Body length"),
        weight: optionalText("Weight"),

        topMaterial: optionalText("Top"),
        backMaterial: optionalText("Back"),
        ribs: optionalText("Ribs"),
        purfling: optionalText("Purfling"),
        varnish: optionalText("Varnish"),

        neck: optionalText("Neck"),
        fingerboard: optionalText("Fingerboard"),
        tuningMachines: optionalText("Tuning machines"),
        strings: optionalText("Strings"),
        bridge: optionalText("Bridge"),
        tailpiece: optionalText("Tailpiece"),

        endpin: optionalText("Endpin"),
        warranty: optionalText("Warranty"),

        content: fields.markdoc({
          label: "Instrument description",
          description:
            "Long-form notes about character, response, setup and suitability.",
          extension: "md",
        }),
      },
    }),
  },
});
