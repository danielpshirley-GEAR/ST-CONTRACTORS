export * from './visualiser-scope';

export type ArchitecturalStyle =
  | 'contemporary_glass'
  | 'industrial_crittall'
  | 'heritage_period'
  | 'scandinavian_minimal';

export type GlazingOption =
  | 'frameless_glass_box'
  | 'slimline_aluminium_bifold'
  | 'crittall_steel_doors'
  | 'heritage_timber_french'
  | 'skylight_roof_lantern';

export type FlooringOption =
  | 'herringbone_engineered_oak'
  | 'microcement_seamless'
  | 'large_porcelain_tiles'
  | 'polished_concrete';

export type WorktopOption =
  | 'calacatta_quartz'
  | 'sintered_stone_dekton'
  | 'carrara_marble'
  | 'solid_oak_butcher';

export interface VisualiserConcept {
  id: string;
  name: string;
  category: 'extension' | 'kitchen' | 'loft' | 'bathroom' | 'garden_studio';
  style: ArchitecturalStyle;
  tagline: string;
  description: string;
  image: string;
  indicativeCostPerM2: number;
  typicalTotalRange: string;
  glazing: GlazingOption;
  flooring: FlooringOption;
  worktop?: WorktopOption;
  structuralNotes: string[];
  statutoryConsiderations: {
    planningStatus: 'Permitted Development likely' | 'Full Planning required' | 'Prior Approval';
    partyWallRequired: boolean;
    buildingRegsPart: string[];
  };
  pros: string[];
  cons: string[];
}
