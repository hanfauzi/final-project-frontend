// app/api/geocode/route.ts

interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  postcode?: string;
}

interface OpenCageResult {
  formatted: string;
  geometry: { lat: number; lng: number };
  components?: OpenCageComponents;
}

interface OpenCageResponse {
  results?: OpenCageResult[];
}

interface SuggestItem {
  display: string;
  latitude: number;
  longitude: number;
  city: string;
  postalCode: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!q) return new Response("q required", { status: 400 });

  const url =
    `https://api.opencagedata.com/geocode/v1/json` +
    `?key=${process.env.OPENCAGE_KEY}` +
    `&q=${encodeURIComponent(q)}` +
    `&language=id&limit=5&no_annotations=1`;

  const r = await fetch(url, { next: { revalidate: 0 } });
  const j: OpenCageResponse = await r.json();

  const results: SuggestItem[] = (j.results ?? []).map((it) => {
    const comps = it.components ?? {};
    const city = comps.city || comps.town || comps.village || "";
    const postalCode = comps.postcode || "";
    return {
      display: it.formatted,
      latitude: it.geometry.lat,
      longitude: it.geometry.lng,
      city,
      postalCode,
    };
  });

  return Response.json(results);
}
