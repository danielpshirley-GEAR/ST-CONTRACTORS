import { LOCATIONS_DATA } from '@/lib/content/locations-data';

export interface LocationArea {
  name: string;
  slug: string;
  borough: string;
  postcodes: string[];
  description: string;
  popularProjects: string[];
}

export const locationsData: LocationArea[] = LOCATIONS_DATA.map((loc) => ({
  name: loc.name,
  slug: loc.slug,
  borough: loc.borough,
  postcodes: loc.postcodes,
  description: loc.intro,
  popularProjects: loc.localArchitecture.popularProperties,
}));
