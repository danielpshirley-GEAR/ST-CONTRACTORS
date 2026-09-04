/**
 * Scope & Deterministic Quantity Calculation Engine
 * Pure mathematical formulas with material-specific waste factors and strict engineering safeguards.
 * Complies with GEMINI.md Section 7 and Phase 7B Specification (Items 18, 19, 20, 21, 22, 23, 24).
 */

import {
  CalculatedQuantityItem,
  ProjectSpace,
  ProjectCategoryType,
  QuantityConfidence,
} from '@/types/visualiser-scope';

export interface CalculationContext {
  flooringMaterial?: string; // 'herringbone_engineered_oak' | 'microcement_seamless' | 'large_porcelain_tiles' | 'straight_plank'
  tilingType?: string;
  confirmedDoorOpeningsM?: number;
  confirmedWindowAreaM2?: number;
  hasStructuralAlteration?: boolean;
  structuralOpeningSpanM?: number;
  structuralEngineerSpecified?: boolean;
}

export function calculateProjectQuantities(
  spaces: ProjectSpace[],
  projectTypes: ProjectCategoryType[],
  hasStructuralKnockthrough: boolean = false,
  context?: CalculationContext
): CalculatedQuantityItem[] {
  const items: CalculatedQuantityItem[] = [];

  const primarySpace = spaces.find((s) => s.isPrimary) || spaces[0];
  const hasConfirmedDimensions = Boolean(
    primarySpace &&
    primarySpace.lengthM?.status === 'confirmed' &&
    primarySpace.widthM?.status === 'confirmed' &&
    primarySpace.lengthM.value > 0 &&
    primarySpace.widthM.value > 0
  );

  const hasAssumedDimensions = Boolean(
    primarySpace &&
    primarySpace.lengthM &&
    primarySpace.widthM &&
    primarySpace.lengthM.value > 0 &&
    primarySpace.widthM.value > 0
  );

  const length = hasAssumedDimensions ? primarySpace.lengthM.value : 0;
  const width = hasAssumedDimensions ? primarySpace.widthM.value : 0;
  const height = primarySpace?.heightM?.value && primarySpace.heightM.value > 0 ? primarySpace.heightM.value : 2.4;
  const floorArea = hasAssumedDimensions ? Math.round(length * width * 10) / 10 : 0;

  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isExtension = projectTypes.includes('extension');
  const isLoft = projectTypes.includes('loft-conversion');
  const isDriveway = projectTypes.includes('driveway');
  const isLandscaping = projectTypes.includes('landscaping');
  const isJoineryOnly = projectTypes.length === 1 && projectTypes.includes('joinery');
  const isDecoratingOnly = projectTypes.includes('bedroom') || projectTypes.includes('decorating');

  // Base confidence for pure dimensions
  const dimensionConfidence: QuantityConfidence = hasConfirmedDimensions
    ? 'CALCULATED_FROM_CONFIRMED_INPUT'
    : hasAssumedDimensions
    ? 'ESTIMATED_FROM_ASSUMPTION'
    : 'INSUFFICIENT_INFORMATION';

  // --------------------------------------------------------------------------
  // 1. FLOORING / PAVING QUANTITY (Material-Specific Waste Factor - Item 21)
  // --------------------------------------------------------------------------
  if (!isJoineryOnly && projectTypes[0] !== 'door-replacement') {
    if (floorArea > 0) {
      const flooringMaterial = context?.flooringMaterial || 'herringbone_engineered_oak';
      let wastePercent = 10;
      let materialLabel = 'Finished Flooring & Subfloor Underlay';

      if (isDriveway) {
        wastePercent = 8;
        materialLabel = 'Driveway Sub-Base & Permeable Block Paving';
      } else if (flooringMaterial.includes('herringbone') || flooringMaterial.includes('parquet')) {
        wastePercent = 15; // Herringbone cutting waste 12-15%
        materialLabel = 'Herringbone Engineered Oak Parquet (with Layout Offcuts)';
      } else if (flooringMaterial.includes('chevron')) {
        wastePercent = 15;
        materialLabel = 'Chevron Architectural Parquet';
      } else if (flooringMaterial.includes('microcement')) {
        wastePercent = 5;
        materialLabel = 'Seamless Architectural Microcement System';
      } else if (flooringMaterial.includes('porcelain') || flooringMaterial.includes('tile')) {
        wastePercent = 12;
        materialLabel = 'Large-Format Porcelain Floor Tiles';
      } else if (flooringMaterial.includes('stone')) {
        wastePercent = 15;
        materialLabel = 'Natural Stone Floor Paving';
      }

      const totalFlooringWithWaste = Math.round(floorArea * (1 + wastePercent / 100) * 10) / 10;

      items.push({
        id: 'qty-flooring',
        item: materialLabel,
        category: 'Finishes',
        netQuantity: floorArea,
        wastePercent,
        totalWithWaste: Math.ceil(totalFlooringWithWaste),
        unit: 'm²',
        confidence: dimensionConfidence,
        basis: `${primarySpace.name} (${length}m × ${width}m)`,
        formulaExplanation: `${length}m length × ${width}m width = ${floorArea}m² net area + ${wastePercent}% material-specific cutting allowance = ${totalFlooringWithWaste}m² (Suggested order quantity: ${Math.ceil(totalFlooringWithWaste)}m²)`,
        materialCategory: isDriveway ? 'blocks' : 'flooring',
      });
    } else {
      items.push({
        id: 'qty-flooring-insufficient',
        item: 'Finished Flooring / Paving',
        category: 'Finishes',
        netQuantity: 0,
        wastePercent: 10,
        totalWithWaste: 0,
        unit: 'm²',
        confidence: 'INSUFFICIENT_INFORMATION',
        basis: 'Dimensions not yet supplied',
        formulaExplanation: 'Requires confirmed room dimensions (length & width) to calculate exact flooring square meterage and layout offcut allowances.',
        materialCategory: 'flooring',
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. WALL LININGS & DECORATING (Openings Safeguards - Item 22)
  // --------------------------------------------------------------------------
  if (floorArea > 0 && !isDriveway && !isLandscaping && !isJoineryOnly && projectTypes[0] !== 'door-replacement') {
    const perimeter = Math.round(2 * (length + width) * 10) / 10;
    const grossWallArea = Math.round(perimeter * height * 10) / 10;

    // Check if openings were confirmed by user
    const hasConfirmedOpenings = context?.confirmedDoorOpeningsM !== undefined || context?.confirmedWindowAreaM2 !== undefined;
    const openingDeductionM2 = hasConfirmedOpenings
      ? (context?.confirmedWindowAreaM2 || 0) + ((context?.confirmedDoorOpeningsM || 0) * height)
      : isExtension
      ? 7.0 // Assumed rear bifold + pass door
      : isBathroom
      ? 2.0 // Standard pass door
      : 4.0; // Standard window & door

    const netWallArea = Math.max(0, Math.round((grossWallArea - openingDeductionM2) * 10) / 10);
    const plasterboardSheets = Math.ceil((netWallArea * 1.1) / 2.88); // 2.4m x 1.2m board

    if (!isBathroom) {
      items.push({
        id: 'qty-plasterboard',
        item: 'Plasterboard Wall Linings (2.4m × 1.2m Sheets)',
        category: 'Drylining',
        netQuantity: netWallArea,
        wastePercent: 10,
        totalWithWaste: plasterboardSheets,
        unit: 'sheets (2.88m²/sheet)',
        confidence: hasConfirmedOpenings && hasConfirmedDimensions ? 'CALCULATED_FROM_CONFIRMED_INPUT' : 'ESTIMATED_FROM_ASSUMPTION',
        basis: `${grossWallArea}m² gross wall perimeter at ${height}m ceiling height minus ${openingDeductionM2}m² openings (${hasConfirmedOpenings ? 'confirmed' : 'assumed standard openings'})`,
        formulaExplanation: `${perimeter}m perimeter × ${height}m height = ${grossWallArea}m² gross minus ${openingDeductionM2}m² openings = ${netWallArea}m² net + 10% cutting waste = ${(netWallArea * 1.1).toFixed(1)}m² ÷ 2.88m²/sheet = ${plasterboardSheets} sheets`,
        materialCategory: 'plasterboard',
      });
    }

    // Decorating Emulsion Paint (Walls + Ceiling)
    const totalDecoratingArea = isBathroom ? grossWallArea * 0.3 + floorArea : netWallArea + floorArea;
    const paintLitres = Math.ceil((totalDecoratingArea * 2) / 10); // 2 coats @ 10m²/Litre

    items.push({
      id: 'qty-paint',
      item: 'Trade Emulsion Wall & Ceiling Paint (2 Full Coats)',
      category: 'Decorating',
      netQuantity: Math.round(totalDecoratingArea * 10) / 10,
      wastePercent: 10,
      totalWithWaste: paintLitres,
      unit: 'Litres (2 full coats)',
      confidence: dimensionConfidence,
      basis: `${netWallArea}m² net walls + ${floorArea}m² ceiling (2 full coats)`,
      formulaExplanation: `(${netWallArea}m² net walls + ${floorArea}m² ceiling) × 2 coats ÷ 10m²/L coverage = ${paintLitres} Litres trade emulsion`,
      materialCategory: 'paint',
    });
  }

  // --------------------------------------------------------------------------
  // 3. BATHROOM SPECIFIC WATERPROOFING & TILING (Item 23)
  // --------------------------------------------------------------------------
  if (isBathroom && floorArea > 0) {
    const wetZoneWallArea = Math.round(2 * 1.8 * height * 10) / 10; // Shower enclosure walls
    const tileArea = Math.round((wetZoneWallArea + floorArea) * 10) / 10;
    const tileWaste = 12;
    const totalTiles = Math.ceil(tileArea * (1 + tileWaste / 100));

    items.push({
      id: 'qty-tanking',
      item: 'Waterproof Tanking Membrane & Corner Seal Tape',
      category: 'Waterproofing',
      netQuantity: wetZoneWallArea + floorArea,
      wastePercent: 10,
      totalWithWaste: Math.ceil((wetZoneWallArea + floorArea) * 1.1),
      unit: 'm²',
      confidence: dimensionConfidence,
      basis: `Shower wet zone (${wetZoneWallArea}m² walls) + bathroom subfloor (${floorArea}m²)`,
      formulaExplanation: `${wetZoneWallArea}m² shower wet walls + ${floorArea}m² floor + 10% overlap joint tape = ${Math.ceil((wetZoneWallArea + floorArea) * 1.1)}m² waterproof membrane`,
      materialCategory: 'tiles',
    });

    items.push({
      id: 'qty-tiles',
      item: 'Porcelain Wall & Floor Tiles (Wet Areas)',
      category: 'Tiling',
      netQuantity: tileArea,
      wastePercent: tileWaste,
      totalWithWaste: totalTiles,
      unit: 'm²',
      confidence: dimensionConfidence,
      basis: `Shower wet walls (${wetZoneWallArea}m²) + Floor (${floorArea}m²)`,
      formulaExplanation: `${tileArea}m² net tiled area + ${tileWaste}% cutting & pipe profile waste = ${totalTiles}m²`,
      materialCategory: 'tiles',
    });
  }

  // --------------------------------------------------------------------------
  // 4. STRUCTURAL STEEL SAFEGUARDS (Item 19 - ENGINEERING REQUIRED)
  // --------------------------------------------------------------------------
  const hasStructural = hasStructuralKnockthrough || (context?.hasStructuralAlteration ?? false);

  if (hasStructural) {
    const spanM = width > 0 ? width : 4.0;
    if (context?.structuralEngineerSpecified) {
      // If engineer has specified exact section
      items.push({
        id: 'qty-steel-specified',
        item: 'Structural Steelwork (Engineer Specified Section)',
        category: 'Structure',
        netQuantity: spanM,
        wastePercent: 10,
        totalWithWaste: Math.round(spanM * 45 * 1.1),
        unit: 'kg steel',
        confidence: 'CALCULATED_FROM_CONFIRMED_INPUT',
        basis: `Engineered steel beam across ${spanM}m opening`,
        formulaExplanation: `${spanM}m span with confirmed structural calculation and padstones`,
        materialCategory: 'steel',
      });
    } else {
      // Strictly ENGINEERING REQUIRED per specification
      items.push({
        id: 'qty-steel-engineering-required',
        item: 'Universal Steel Beam (RSJ) Structural Knockthrough Frame',
        category: 'Structure',
        netQuantity: spanM,
        wastePercent: 0,
        totalWithWaste: 0,
        unit: 'Structural Design Required',
        confidence: 'ENGINEERING_REQUIRED',
        basis: `Proposed opening span: ~${spanM}m`,
        formulaExplanation: 'Beam section size, steel tonnage (kg/m), padstone bearing depth, and deflection checks cannot be guessed. A chartered structural engineer must perform Building Regulations Part A calculations before exact steel quantities can be specified.',
        materialCategory: 'steel',
        engineeringNote: 'Beam size: Not determined • Steel quantity: Not determined • Required: Structural engineer design and Building Control approval.',
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. FOUNDATION CONCRETE SAFEGUARDS (Item 20 - PRELIMINARY RANGE / ENGINEERING REQUIRED)
  // --------------------------------------------------------------------------
  if (isExtension && floorArea > 0) {
    const trenchPerimeter = Math.round(((2 * length) + width) * 10) / 10;
    items.push({
      id: 'qty-foundation-engineering-required',
      item: 'Ready-Mix C25/30 Foundation Trench Concrete',
      category: 'Groundworks',
      netQuantity: trenchPerimeter,
      wastePercent: 5,
      totalWithWaste: 0,
      unit: 'Preliminary Range (M³ Requires Site Survey)',
      confidence: 'ENGINEERING_REQUIRED',
      basis: `Estimated ~${trenchPerimeter}m external perimeter trench`,
      formulaExplanation: `Trench perimeter ~${trenchPerimeter}m. Foundation depth depends on local soil shrinkability (London clay), proximity to high water-demand trees, existing drainage invert levels, and Building Control inspection. Typical London foundations range from 1.0m to 2.5m+ deep.`,
      materialCategory: 'concrete',
      engineeringNote: 'Foundation depth and concrete volume require structural engineer foundation design and trial hole inspection.',
    });
  }

  // --------------------------------------------------------------------------
  // 6. GLAZED APERTURES (Extensions & Kitchens)
  // --------------------------------------------------------------------------
  if ((isExtension || isKitchen) && width > 0 && !isJoineryOnly) {
    const apertureWidth = Math.min(width, 4.5);
    items.push({
      id: 'qty-glazing',
      item: 'Slimline Architectural Aluminium Glazed Rear Aperture',
      category: 'Glazing',
      netQuantity: apertureWidth,
      wastePercent: 0,
      totalWithWaste: apertureWidth,
      unit: 'linear metres (m)',
      confidence: hasConfirmedDimensions ? 'CALCULATED_FROM_CONFIRMED_INPUT' : 'ESTIMATED_FROM_ASSUMPTION',
      basis: `Sized for ${width}m rear aperture elevation`,
      formulaExplanation: `Designed to span ~${apertureWidth}m aperture with high-performance solar control double/triple glazing.`,
      materialCategory: 'glazing',
    });
  }

  return items;
}
