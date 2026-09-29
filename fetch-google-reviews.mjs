// Pulls Infinity Stone Works' current Google reviews and bakes them into a
// static JSON file that reviews/index.html fetches at page load. Run this by
// hand whenever you want to refresh the Google section — there is no live
// API call from the browser, so visitors never see (or cost you) anything
// beyond loading that JSON file.
//
// Usage:
//   1. Copy .env.example to .env and fill in GOOGLE_PLACES_API_KEY.
//   2. node fetch-google-reviews.mjs
//   3. Commit the updated assets/reviews/google-reviews.json.
//
// Requires the "Places API (New)" enabled on a Google Cloud project with
// billing set up. This script makes two calls per run (a text search to
// resolve the Place ID, then a place-details call for the reviews) — at
// that volume you should stay well within Google's monthly free credit
// even running this every day, let alone occasionally by hand.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, ".env"));

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BUSINESS_QUERY = "Infinity Stone Works, 5503 Steilacoom Blvd SW, Lakewood, WA 98499";
const OUT_PATH = path.join(__dirname, "assets", "reviews", "google-reviews.json");

if (!API_KEY || API_KEY === "your-api-key-here") {
  console.error(
    "Missing GOOGLE_PLACES_API_KEY.\n" +
    "Copy .env.example to .env and fill in a real Places API key, then rerun this script."
  );
  process.exit(1);
}

async function resolvePlaceId() {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: BUSINESS_QUERY }),
  });

  if (!res.ok) {
    throw new Error(`Place search failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const place = data.places?.[0];
  if (!place) {
    throw new Error(`No place found for query: "${BUSINESS_QUERY}"`);
  }
  console.log(`Resolved place: ${place.displayName?.text} — ${place.formattedAddress}`);
  return place.id;
}

async function fetchReviews(placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
    },
  });

  if (!res.ok) {
    throw new Error(`Place details failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

function normalize(place) {
  return {
    rating: place.rating ?? null,
    total: place.userRatingCount ?? 0,
    mapsUrl: place.googleMapsUri ?? null,
    fetchedAt: new Date().toISOString(),
    // Google's Places API caps this at 5 reviews, chosen by their own
    // "relevance" ranking — there is no way to request more or paginate.
    reviews: (place.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      photoUrl: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? null,
      relativeTime: r.relativePublishTimeDescription ?? "",
      text: r.text?.text ?? r.originalText?.text ?? "",
    })),
  };
}

try {
  const placeId = await resolvePlaceId();
  const place = await fetchReviews(placeId);
  const normalized = normalize(place);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(normalized, null, 2) + "\n");

  console.log(`Saved ${normalized.reviews.length} review(s) to ${path.relative(__dirname, OUT_PATH)}`);
  console.log(`Rating: ${normalized.rating} (${normalized.total} total ratings)`);
} catch (err) {
  console.error("Failed to fetch Google reviews:", err.message);
  process.exit(1);
}
