import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["a.espncdn.com", "site.web.api.espn.com", "site.api.espn.com"]);

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) return new NextResponse(null, { status: 400 });

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
      return new NextResponse(null, { status: 403 });
    }

    const response = await fetch(url, {
      headers: { Accept: "image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8" },
      next: { revalidate: 86400 },
    });

    if (!response.ok) return new NextResponse(null, { status: 404 });

    const contentType = response.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) return new NextResponse(null, { status: 415 });

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
