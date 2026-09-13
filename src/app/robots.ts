import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.qolet.ir/sitemap.xml",
    host: "https://www.qolet.ir",
  };
}
