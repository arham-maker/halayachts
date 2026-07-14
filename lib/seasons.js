export const SEASONS = [
  { value: "high", label: "High Season" },
  { value: "mid", label: "Mid Season" },
  { value: "low", label: "Low Season" },
];

export const SEASON_LABELS = {
  high: "High Season",
  mid: "Mid Season",
  low: "Low Season",
};

export function normalizeSeason(season) {
  if (!season) return null;
  const value = String(season).toLowerCase().trim();

  if (["high", "high_season", "high-season", "high season"].includes(value)) {
    return "high";
  }
  if (
    ["mid", "mid_season", "mid-season", "mid season", "shoulder"].includes(value)
  ) {
    return "mid";
  }
  if (["low", "low_season", "low-season", "low season"].includes(value)) {
    return "low";
  }

  return null;
}

export function getAvailableSeasons(prices = []) {
  const found = new Set();

  prices.forEach((price) => {
    const season = normalizeSeason(price?.season);
    if (season) found.add(season);
  });

  return SEASONS.filter((season) => found.has(season.value));
}

export function hasSeasonPricing(prices = []) {
  return getAvailableSeasons(prices).length > 0;
}

export function filterPricesBySeason(prices = [], season) {
  if (!Array.isArray(prices) || prices.length === 0) return [];

  if (!hasSeasonPricing(prices)) {
    return prices;
  }

  const selected = normalizeSeason(season);
  if (!selected) return [];

  return prices.filter((price) => normalizeSeason(price?.season) === selected);
}

export function getDefaultSeason(prices = []) {
  const available = getAvailableSeasons(prices);
  return available[0]?.value || null;
}

export function formatPriceDuration(price) {
  if (!price) return "";
  if (price.label) return price.label;
  const hours = price.charter_hours ?? "";
  const label = price.charter_hours_label || "hrs";
  return `${hours} ${label}`.trim();
}

export function getSeasonDisplayLabel(priceOrSeason) {
  if (!priceOrSeason) return "";

  if (typeof priceOrSeason === "string") {
    const key = normalizeSeason(priceOrSeason);
    return key ? SEASON_LABELS[key] : "";
  }

  const key = normalizeSeason(priceOrSeason.season);
  if (!key) return "";

  const base = SEASON_LABELS[key];
  if (priceOrSeason.season_dates) {
    return `${base} ${priceOrSeason.season_dates}`;
  }
  return base;
}
