// src/planetsApi.ts
export const getPlanets = async () => {
  try {
    const response = await fetch(
      "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+10+pl_name,hostname,disc_year+from+ps&format=json"
    );
    const planets = await response.json();
    return planets.map((p: any, index: number) => ({
      id: index + 1,
      name: p.pl_name,
      starName: p.hostname,
      discoveryYear: p.disc_year,
      description: "Exoplanet from NASA archive.",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};
