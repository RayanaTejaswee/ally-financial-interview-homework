

type RawNeo = {
  id?: string;
  name?: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: {
    kilometers?: {
      estimated_diameter_min?: number;
      estimated_diameter_max?: number;
    };
  };
  close_approach_data?: Array<{
    close_approach_date?: string;
    relative_velocity?: { kilometers_per_hour?: string };
    miss_distance?: { kilometers?: string };
  }>;
};

type RawFeed =
  | {
      element_count?: number | null;
      near_earth_objects?: Record<string, RawNeo[]> | null;
    }
  | null
  | undefined;

export type NearEarthObject = {
  id: string | null;
  name: string | null;
  isPotentiallyHazardousAsteroid: boolean | null;
  estimatedDiameterMinKm: number | null;
  estimatedDiameterMaxKm: number | null;
  closeApproachDate: string | null;
  relativeVelocityKph: string | null;
  missDistanceKm: string | null;
};

export type NearEarthObjectFeed = {
  elementCount: number | null;
  objects: NearEarthObject[];
};

const mapObject = (neo: RawNeo): NearEarthObject => {
  const approach = neo.close_approach_data?.[0];
  return {
    id: neo.id ?? null,
    name: neo.name ?? null,
    isPotentiallyHazardousAsteroid: neo.is_potentially_hazardous_asteroid ?? null,
    estimatedDiameterMinKm: neo.estimated_diameter?.kilometers?.estimated_diameter_min ?? null,
    estimatedDiameterMaxKm: neo.estimated_diameter?.kilometers?.estimated_diameter_max ?? null,
    closeApproachDate: approach?.close_approach_date ?? null,
    relativeVelocityKph: approach?.relative_velocity?.kilometers_per_hour ?? null,
    missDistanceKm: approach?.miss_distance?.kilometers ?? null,
  };
};

export const mapNeoFeed = (feed: RawFeed): NearEarthObjectFeed => {
  const byDate = feed?.near_earth_objects ?? {};
  return {
    elementCount: feed?.element_count ?? null,
    objects: Object.values(byDate).flat().map(mapObject),
  };
};
