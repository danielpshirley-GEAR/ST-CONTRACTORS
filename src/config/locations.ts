export interface LocationArea {
  name: string;
  slug: string;
  borough: string;
  postcodes: string[];
  description: string;
  popularProjects: string[];
}

export const locationsData: LocationArea[] = [
  {
    name: 'Ealing',
    slug: 'ealing',
    borough: 'London Borough of Ealing',
    postcodes: ['W5', 'W13'],
    description: 'Specializing in Victorian and Edwardian rear kitchen extensions, loft conversions, and architectural renovations across Ealing Broadway, Pitshanger, and West Ealing.',
    popularProjects: ['Rear Kitchen Extensions', 'Dormer Loft Conversions', 'Full Victorian Renovations'],
  },
  {
    name: 'Richmond',
    slug: 'richmond',
    borough: 'London Borough of Richmond upon Thames',
    postcodes: ['TW9', 'TW10'],
    description: 'Conservation-compliant residential renovations, period restoration, and bespoke garden studios across Richmond Hill, Kew, and East Sheen.',
    popularProjects: ['Period Restorations', 'High-Spec Kitchens', 'Architectural Garden Studios'],
  },
  {
    name: 'Chiswick',
    slug: 'chiswick',
    borough: 'London Borough of Hounslow',
    postcodes: ['W4'],
    description: 'Transforming period family homes with side-return kitchen extensions, glass roofs, and structural wall removals across Chiswick High Road and Bedford Park.',
    popularProjects: ['Side Return Extensions', 'Basement Conversions', 'Open-Plan Knockthroughs'],
  },
  {
    name: 'Harrow',
    slug: 'harrow',
    borough: 'London Borough of Harrow',
    postcodes: ['HA1', 'HA2', 'HA3'],
    description: 'Substantial semi-detached and detached double-storey extensions, driveway paving, and modern full-house overhauls in Harrow on the Hill and surrounding areas.',
    popularProjects: ['Double Storey Extensions', 'Garage Conversions', 'Permeable Resin Driveways'],
  },
];
