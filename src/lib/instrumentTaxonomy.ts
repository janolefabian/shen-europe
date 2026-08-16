export const bassQualityOptions = [
  { label: "SB-80", value: "SB-80" },
  { label: "SB-88", value: "SB-88" },
  { label: "SB-90", value: "SB-90" },
  { label: "SB-100", value: "SB-100" },
  { label: "SB-150", value: "SB-150" },
  { label: "SB-180", value: "SB-180" },
  { label: "SB-190", value: "SB-190" },
  { label: "SB-200", value: "SB-200" },
  { label: "SB-288", value: "SB-288" },
  { label: "SB-300", value: "SB-300" },
  { label: "SB-800", value: "SB-800" },
  { label: "SB-1000", value: "SB-1000" },
] as const;

export const bassModelGroups = [
  {
    label: "Vollmassiv – Ahorn",
    options: [
      {
        label: "Rogeri 3/4",
        value: "Rogeri",
        qualities: ["SB-200", "SB-300", "SB-800"],
      },
      {
        label: "Mirecourt 3/4",
        value: "Mirecourt",
        qualities: ["SB-200", "SB-300", "SB-800"],
      },
      {
        label: "Busetto 3/4",
        value: "Busetto",
        qualities: ["SB-200", "SB-300", "SB-800"],
      },
      {
        label: "Shen Classic 3/4",
        value: "Shen Classic 3/4 Maple",
        qualities: ["SB-200", "SB-300", "SB-800"],
      },
      {
        label: "Shen 5/8",
        value: "Shen 5/8 Maple",
        qualities: ["SB-200", "SB-300", "SB-800"],
      },
      {
        label: "Panormo",
        value: "Panormo",
        qualities: ["SB-1000"],
      },
    ],
  },
  {
    label: "Vollmassiv – Weide",
    options: [
      {
        label: "Rogeri Willow",
        value: "Rogeri Willow",
        qualities: ["SB-200"],
      },
      {
        label: "Shen Willow 3/4 Flatback",
        value: "Shen Willow 3/4 Flatback",
        qualities: ["SB-200"],
      },
      {
        label: "Gemunder 7/8 Willow",
        value: "Gemunder 7/8 Willow",
        qualities: ["SB-200"],
      },
      {
        label: "Gemunder 7/8 Willow · 5-Saiter",
        value: "Gemunder 7/8 Willow 5-String",
        qualities: ["SB-200"],
      },
    ],
  },
  {
    label: "Vollmassiv – Mahagoni",
    options: [
      {
        label: "Shen Classic 3/4 Mahogany",
        value: "Shen Classic 3/4 Mahogany",
        qualities: ["SB-288"],
      },
    ],
  },
  {
    label: "Hybrid",
    options: [
      {
        label: "Shen 3/4 Hybrid",
        value: "Shen 3/4 Hybrid",
        qualities: ["SB-150"],
      },
      {
        label: "Shen 3/4 Flamed Hybrid",
        value: "Shen 3/4 Flamed Hybrid",
        qualities: ["SB-180"],
      },
      {
        label: "Rogeri Hybrid",
        value: "Rogeri Hybrid",
        qualities: ["SB-190"],
      },
      {
        label: "Gemunder 7/8 Hybrid",
        value: "Gemunder 7/8 Hybrid",
        qualities: ["SB-150"],
      },
    ],
  },
  {
    label: "Laminat",
    options: [
      {
        label: "Shen Laminated",
        value: "Shen Laminated",
        qualities: ["SB-80", "SB-88", "SB-100"],
      },
      {
        label: "Shen Blonde",
        value: "Shen Blonde",
        qualities: ["SB-90"],
      },
    ],
  },
] as const;

export const bassQualityValues = bassQualityOptions.map(({ value }) => value);

export const bassModelOptions = bassModelGroups.flatMap((group) =>
  group.options.map((option) => ({
    label: `${option.label} · ${group.label}`,
    value: option.value,
  })),
);

export const bassModelValues = bassModelOptions.map(({ value }) => value);

export function isBassModelAvailableForQuality(
  model: string,
  quality: string,
): boolean {
  return bassModelGroups.some((group) =>
    group.options.some(
      (option) =>
        option.value === model &&
        (option.qualities as readonly string[]).includes(quality),
    ),
  );
}
