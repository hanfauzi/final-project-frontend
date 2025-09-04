// app/api/revgeo/route.ts
interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface OpenCageResult {
  formatted: string;
  components: OpenCageComponents;
}

interface OpenCageResponse {
  results: OpenCageResult[];
}

export type ReverseGeoOut = {
  formatted: string;
  city: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (!lat || !lng) return new Response("lat,lng required", { status: 400 });

  const url =
    `https://api.opencagedata.com/geocode/v1/json` +
    `?key=${process.env.OPENCAGE_KEY}` +
    `&q=${lat}+${lng}` +
    `&language=id&no_annotations=1&limit=1`;

  const resp = await fetch(url, { next: { revalidate: 0 } });
  const json: OpenCageResponse = await resp.json();

  const first = json.results?.[0];
  const comps = first?.components ?? {};
  const city =
    comps.city || comps.town || comps.village || comps.county || comps.state || comps.country || "";

  const out: ReverseGeoOut = {
    formatted: first?.formatted ?? "",
    city,
  };
  return Response.json(out);
}
