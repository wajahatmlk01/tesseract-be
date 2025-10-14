// src/planetsApi.ts
export const getPlanets = async () => {
  try {
    const response = await fetch(
      "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+200+pl_name,hostname,disc_year,pl_orbper,pl_eqt,discoverymethod+from+ps&format=json"
    );

    const planets = await response.json();

    // 🧹 Remove duplicates by planet name
    const uniquePlanets = Array.from(
      new Map(planets.map((p: any) => [p.pl_name, p])).values()
    );

    // 🚫 Ban specific planets by name
    const bannedPlanets = ["Kepler-491 b", "Kepler-259 c"];
    const filteredPlanets = uniquePlanets.filter(
      (p: any) => !bannedPlanets.includes(p.pl_name)
    );

    // ✅ Return first 8 allowed planets with clean info
    return filteredPlanets.slice(0, 8).map((p: any, index: number) => ({
      id: index + 1,
      name: p.pl_name,
      starName: p.hostname,
      discoveryYear: p.disc_year,
      orbitalPeriod: p.pl_orbper ?? "unknown",
      equilibriumTemp: p.pl_eqt ?? "unknown",
      discoveryMethod: p.discoverymethod ?? "unknown",
      description: `${p.pl_name} orbits ${p.hostname}, discovered in ${p.disc_year}. 
      Orbital period: ${p.pl_orbper ?? "unknown"} days. 
      Equilibrium temperature: ${p.pl_eqt ?? "unknown"} K. 
      Discovery method: ${p.discoverymethod ?? "unknown"}.`,
    }));
  } catch (err) {
    console.error("Error fetching planets:", err);
    return [];
  }
};




/* 
=== SAFE BACKUP VERSION (use if images stop working) ===
This version automatically normalizes planet names and prevents CORB blocking.
Uncomment it if you face missing images or API name changes.
*/

// const safeImageMap: Record<string, string> = {
//   "kepler-6b": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mega-earth.jpg",
//   "kepler-491b": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Kepler-10b.jpg",
//   "kepler-257b": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Kepler186f-ArtistConcept-20140417.jpg",
//   "kepler-216b": "https://science.nasa.gov/wp-content/uploads/2023/06/may102022-x1pt5flare-171-131-304-jpg.webp",
//   "kepler-32c": "https://cdn.sci.news/images/enlarge4/image_5811e-K2-151b.jpg",
//   "kepler-259c": "https://exoplanets.nasa.gov/system/news_items/main_images/903_exoplanet-art-5.jpg",
//   "kepler-148c": "https://assets.science.nasa.gov/dynamicimage/assets/science/astro/exo-explore/assets/content/planets/gasgiant-7.jpg",
//   "kepler-222d": "https://assets.science.nasa.gov/dynamicimage/assets/science/astro/exo-explore/assets/content/planets/neptunelike-8.jpg",
//   "kepler-29c": "https://www.exoplanetkyoto.org/wp-content/uploads/2016/08/HD209458b2.jpg",
//   "kepler-179b": "https://chview.nova.org/solcom/stars2/hd70642b.jpg",
// };

// const normalizeName = (name: string) =>
//   name.toLowerCase().replace(/\s+/g, "").replace("-", "");

// const findSafeImage = (name: string) => {
//   const key = normalizeName(name);
//   return safeImageMap[key] || "/fallback.jpg";
// };*/
