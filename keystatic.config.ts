import { collection, config, fields } from "@keystatic/core";

const requiredText = (label: string, description?: string) =>
  fields.text({
    label,
    description,
    validation: { isRequired: true },
  });

const optionalText = (label: string, description?: string) =>
  fields.text({ label, description });

export default config({
  storage: { kind: "local" },

  ui: {
    brand: { name: "Shen Europe" },
    navigation: { Content: ["instruments"] },
  },

  collections: {
    instruments: collection({
      label: "Instruments",
      path: "src/content/instruments/*/",
      slugField: "title",
      entryLayout: "form",
      columns: ["title", "inventory", "model", "status"],
      format: { data: "yaml", contentField: "content" },

      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "Public instrument name.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Content folder",
            description:
              "Internal folder name. Keep this stable after publishing.",
          },
        }),

        slug: fields.text({
          label: "Public URL slug",
          description: "Used for /instruments/… — lowercase and hyphens only.",
          validation: {
            isRequired: true,
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Use lowercase letters, numbers and single hyphens only.",
            },
          },
        }),
        inventory: requiredText("Inventory number"),

        model: requiredText("Model", "For example SB-800."),
        outline: requiredText("Outline", "For example Mirecourt."),
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
          description: "Shown on cards and at the top of the detail page.",
          multiline: true,
          validation: { isRequired: true },
        }),

        hero: fields.image({
          label: "Hero image",
          description: "Main image used on listings and the detail page.",
        }),
        gallery: fields.array(
          fields.image({
            label: "Gallery image",
            validation: { isRequired: true },
          }),
          {
            label: "Gallery images",
            description: "Drag entries to control their display order.",
            itemLabel: () => "Gallery image",
          },
        ),

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
