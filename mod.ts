import { join } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import { pick } from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Planet {
  [key: string]: string;
}

function loadPlanetData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");
  const file = Deno.readTextFileSync(path);
  const result = parse(file, {
    skipFirstRow: true,
    comment: "#",
  });

  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarRadius = Number(planet["koi_srad"]);
    const stellarMass = Number(planet["koi_smass"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      stellarRadius > 0.99 && stellarRadius < 1.01 &&
      stellarMass > 0.78 && stellarMass < 1.04;
  });

  planets.sort((planetA, planetB) => {
    const orbitA = Number(planetA.koi_period);
    const orbitB = Number(planetB.koi_period);

    if (orbitA < orbitB) {
        return 1;
    }
    if (orbitA > orbitB) {
        return -1;
    }
    return 0
  });

  const finalPlanets: Array<Planet> = new Array<Planet>(); 
  finalPlanets.push(pick(planets.at(0), [
    "kepler_name",
    "koi_period",
    "koi_prad",
    "koi_smass",
    "koi_srad",
    "koi_count",
    "koi_steff",
    ]))
  finalPlanets.push(pick(planets.at(-1), [
    "kepler_name",
    "koi_period",
    "koi_prad",
    "koi_smass",
    "koi_srad",
    "koi_count",
    "koi_steff",
    ]))

    return finalPlanets;
}

const newEarths = loadPlanetData();
for (const planet of newEarths) {
  console.log(planet);
}
console.log(`${newEarths.length} habitable planets found!`);
