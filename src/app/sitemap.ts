import type { MetadataRoute } from "next";

const years = [1404, 1405, 1406, 1407];
const base = "https://www.qolet.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = [
    { url: base, priority: 1, changeFrequency: "daily" as const },
    { url: `${base}/today`, priority: 0.95, changeFrequency: "daily" as const },
    { url: `${base}/calendar`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${base}/time`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${base}/events`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${base}/prayer-times`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${base}/date-converter`, priority: 0.75, changeFrequency: "monthly" as const },
    { url: `${base}/gold`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${base}/dollar`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${base}/coin`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${base}/football`, priority: 0.9, changeFrequency: "hourly" as const },
  ];
  const yearPages = years.map((year) => ({ url: `${base}/calendar/${year}`, priority: 0.75, changeFrequency: "monthly" as const }));
  const monthPages = years.flatMap((year) =>
    Array.from({ length: 12 }, (_, i) => ({
      url: `${base}/calendar/${year}/${i + 1}`,
      priority: 0.65,
      changeFrequency: "monthly" as const,
    }))
  );
  return [...core, ...yearPages, ...monthPages].map((item) => ({
    ...item,
    lastModified: new Date(),
  }));
}
