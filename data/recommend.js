import { PARKS } from "../data/parks.js";


export function scoreParksForPreferences(preferences = {}) {
  const { interests = [], season = "", climate = "", safariType = "" } = preferences;

  const scored = PARKS.map((park) => {
    let score = 0;
    const reasons = [];

    const matchedInterests = interests.filter((i) => park.interests.includes(i));
    if (matchedInterests.length) {
      score += matchedInterests.length * 3;
      reasons.push(`Matches interest in ${matchedInterests.join(", ")}`);
    }
    if (season && park.seasons.includes(season)) {
      score += 2;
      reasons.push(`Great during ${season}`);
    }
    if (climate && park.climate === climate) {
      score += 2;
      reasons.push(`${park.climate} climate as requested`);
    }
    if (safariType && park.safariTypes.includes(safariType)) {
      score += 2;
      reasons.push(`Offers ${safariType.toLowerCase()}`);
    }
    if (safariType === "Malaria-free priority" && park.malariaFree) {
      score += 3;
      reasons.push("Malaria-free destination");
    }
    score += park.rating;

    return { park, score, reasons };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}