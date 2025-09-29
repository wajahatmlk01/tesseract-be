// src/planetsApi.ts
export const getPlanets = async () => {
  try {
    // Fetch top 10 exoplanets with correct columns
    const response = await fetch(
      "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+10+pl_name,hostname,disc_year,pl_orbper,pl_eqt,discoverymethod+from+ps&format=json"
    );
    const planets = await response.json();

    return planets.map((p: any, index: number) => ({
      id: index + 1,
      name: p.pl_name,
      starName: p.hostname,
      discoveryYear: p.disc_year,
      orbitalPeriod: p.pl_orbper ?? "unknown",
      equilibriumTemp: p.pl_eqt ?? "unknown",
      discoveryMethod: p.discoverymethod ?? "unknown",
      description: `${p.pl_name} orbits ${p.hostname}, discovered in ${p.disc_year}. Orbital period: ${p.pl_orbper ?? "unknown"} days, Equilibrium temp: ${p.pl_eqt ?? "unknown"}K, Discovery method: ${p.discoverymethod ?? "unknown"}`
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};
