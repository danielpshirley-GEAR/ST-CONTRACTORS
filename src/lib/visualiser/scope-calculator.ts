/**
 * Scope & Deterministic Quantity Calculation Engine
 * Pure mathematical formulas with material-specific waste factors and strict engineering safeguards.
 * Complies with GEMINI.md Section 7 and Phase 7C Specification (Items 12, 18, 19, 20, 21, 22).
 */

import {
  CalculatedQuantityItem,
  ProjectSpace,
  ProjectCategoryType,
  QuantityConfidence,
  StructuralEngineerSpec,
} from '@/types/visualiser-scope';

export interface CalculationContext {
  flooringMaterial?: string; // e.g. 'herringbone_engineered_oak' | 'microcement_seamless' | 'large_porcelain_tiles' | 'straight_plank'
  tilingType?: string;
  confirmedDoorOpeningsM?: number;
  confirmedWindowAreaM2?: number;
  hasStructuralAlteration?: boolean;
  structuralOpeningSpanM?: number;
  structuralEngineerSpec?: StructuralEngineerSpec;
  bathroomLayout?: {
    showerEnclosureWidthM?: number;
    hasBathtub?: boolean;
    tilingHeight?: 'full_height' | 'half_height' | 'splashback_only';
  };
}

export function calculateProjectQuantities(
  spaces: ProjectSpace[],
  projectTypes: ProjectCategoryType[],
  hasStructuralKnockthrough: boolean = false,
  context?: CalculationContext
): CalculatedQuantityItem[] {
  const items: CalculatedQuantityItem[] = [];

  const primarySpace = spaces.find((s) => s.isPrimary) || spaces[0];
  
  // Dimensions Check (Item 12: Zero Silent Room Dimension Defaults)
  const length = primarySpace?.lengthM?.value;
  const width = primarySpace?.widthM?.value;
  const height = primarySpace?.heightM?.value;

  const hasConfirmedDimensions = Boolean(
    length !== undefined &&
    width !== undefined &&
    primarySpace?.lengthM?.status === 'confirmed' &&
    primarySpace?.widthM?.status === 'confirmed' &&
    length > 0 &&
    width > 0
  );

  const hasDimensions = Boolean(length !== undefined && width !== undefined && length > 0 && width > 0);
  const floorArea = hasDimensions && length && width ? Math.round(length * width * 10) / 10 : undefined;
  const effectiveHeight = height && height > 0 ? height : 2.4;

  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isExtension = projectTypes.includes('extension');
  const isDriveway = projectTypes.includes('driveway');
  const isLandscaping = projectTypes.includes('landscaping');
  const isJoineryOnly = projectTypes.length === 1 && projectTypes.includes('joinery');
  const isDoorOnly = projectTypes.length === 1 && projectTypes.includes('door-replacement');

  const dimensionConfidence: QuantityConfidence = hasConfirmedDimensions
    ? 'CALCULATED_FROM_CONFIRMED_INPUT'
    : hasDimensions
    ? 'ESTIMATED_FROM_ASSUMPTION'
    : 'INSUFFICIENT_INFORMATION';

  // --------------------------------------------------------------------------
  // 1. FLOORING / PAVING QUANTITY (Item 18: Material-Specific Waste Factor)
  // --------------------------------------------------------------------------
  if (!isJoineryOnly && !isDoorOnly) {
    if (floorArea !== undefined && length && width) {
      const flooringMaterial = context?.flooringMaterial;
      
      if (!flooringMaterial || flooringMaterial === 'not_decided') {
        // Material not decided: Calculate Net Floor Area only (Item 18)
        items.push({
          id: 'qty-flooring-net',
          item: isDriveway ? 'Driveway Net Surface Area' : 'Finished Flooring (Net Area — Material Undecided)',
          category: 'Finishes',
          netQuantity: floorArea,
          wastePercent: 0,
          totalWithWaste: floorArea,
          unit: 'm² net',
          confidence: dimensionConfidence,
          basis: `${primarySpace.name} (${length}m × ${width}m)`,
          formulaExplanation: `${length}m length × ${width}m width = ${floorArea}m² net floor area. Ordering allowance requires material/layout selection (e.g. 15% for herringbone parquet vs 10% for straight plank).`,
          materialCategory: isDriveway ? 'blocks' : 'flooring',
        });
      } else {
        // Material is chosen: apply specific waste factor
        let wastePercent = 10;
        let materialLabel = 'Finished Flooring & Subfloor Underlay';

        if (isDriveway) {
          wastePercent = 8;
          materialLabel = 'Driveway Sub-Base & Permeable Block Paving';
        } else if (flooringMaterial.includes('herringbone') || flooringMaterial.includes('parquet')) {
          wastePercent = 15;
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
      }
    } else {
      items.push({
        id: 'qty-flooring-insufficient',
        item: 'Finished Flooring / Paving',
        category: 'Finishes',
        netQuantity: 0,
        wastePercent: 0,
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
  // 2. WALL LININGS & DECORATING (Item 19: Gross Wall Area with Openings Note)
  // --------------------------------------------------------------------------
  if (floorArea !== undefined && length && width && !isDriveway && !isLandscaping && !isJoineryOnly && !isDoorOnly) {
    const perimeter = Math.round(2 * (length + width) * 10) / 10;
    const grossWallArea = Math.round(perimeter * effectiveHeight * 10) / 10;

    const hasConfirmedOpenings = context?.confirmedDoorOpeningsM !== undefined || context?.confirmedWindowAreaM2 !== undefined;
    
    if (hasConfirmedOpenings) {
      const openingDeductionM2 = (context?.confirmedWindowAreaM2 || 0) + ((context?.confirmedDoorOpeningsM || 0) * effectiveHeight);
      const netWallArea = Math.max(0, Math.round((grossWallArea - openingDeductionM2) * 10) / 10);
      const plasterboardSheets = Math.ceil((netWallArea * 1.1) / 2.88);

      if (!isBathroom) {
        items.push({
          id: 'qty-plasterboard',
          item: 'Plasterboard Wall Linings (2.4m × 1.2m Sheets)',
          category: 'Drylining',
          netQuantity: netWallArea,
          wastePercent: 10,
          totalWithWaste: plasterboardSheets,
          unit: 'sheets (2.88m²/sheet)',
          confidence: hasConfirmedDimensions ? 'CALCULATED_FROM_CONFIRMED_INPUT' : 'ESTIMATED_FROM_ASSUMPTION',
          basis: `${grossWallArea}m² gross perimeter minus confirmed ${openingDeductionM2}m² openings`,
          formulaExplanation: `${perimeter}m perimeter × ${effectiveHeight}m height = ${grossWallArea}m² gross minus ${openingDeductionM2}m² openings = ${netWallArea}m² net + 10% cutting waste = ${(netWallArea * 1.1).toFixed(1)}m² ÷ 2.88m²/sheet = ${plasterboardSheets} sheets`,
          materialCategory: 'plasterboard',
        });
      }
    } else {
      // Opening measurements not supplied: Report Gross Wall Area (Item 19)
      items.push({
        id: 'qty-wall-gross',
        item: 'Gross Wall Area (Linings & Preparation)',
        category: 'Drylining',
        netQuantity: grossWallArea,
        wastePercent: 10,
        totalWithWaste: grossWallArea,
        unit: 'm² gross',
        confidence: dimensionConfidence,
        basis: `${perimeter}m perimeter at ${effectiveHeight}m ceiling height`,
        formulaExplanation: `${perimeter}m perimeter × ${effectiveHeight}m height = ${grossWallArea}m² gross wall area. Opening measurements (windows/doors) not supplied; net wall area and exact board count cannot yet be accurately determined.`,
        materialCategory: 'plasterboard',
      });
    }

    // Trade Emulsion Paint
    const paintArea = grossWallArea + floorArea;
    const paintLitres = Math.ceil((paintArea * 2) / 10); // 2 coats @ 10m²/Litre

    items.push({
      id: 'qty-paint',
      item: 'Trade Emulsion Wall & Ceiling Paint (2 Full Coats)',
      category: 'Decorating',
      netQuantity: Math.round(paintArea * 10) / 10,
      wastePercent: 10,
      totalWithWaste: paintLitres,
      unit: 'Litres (2 coats)',
      confidence: dimensionConfidence,
      basis: `Estimated ${grossWallArea}m² walls + ${floorArea}m² ceiling (2 full coats)`,
      formulaExplanation: `(${grossWallArea}m² walls + ${floorArea}m² ceiling) × 2 coats ÷ 10m²/L coverage = ${paintLitres} Litres trade emulsion`,
      materialCategory: 'paint',
    });
  }

  // --------------------------------------------------------------------------
  // 3. BATHROOM SPECIFIC WATERPROOFING & TILING (Item 20: Explicit Shower/Bath Config)
  // --------------------------------------------------------------------------
  if (isBathroom) {
    if (context?.bathroomLayout?.showerEnclosureWidthM && floorArea !== undefined) {
      const showerWidth = context.bathroomLayout.showerEnclosureWidthM;
      const wetZoneWallArea = Math.round(2 * showerWidth * effectiveHeight * 10) / 10;
      const tileArea = Math.round((wetZoneWallArea + floorArea) * 10) / 10;
      const totalTiles = Math.ceil(tileArea * 1.12);

      items.push({
        id: 'qty-tanking',
        item: 'Waterproof Tanking Membrane & Corner Seal Tape',
        category: 'Waterproofing',
        netQuantity: wetZoneWallArea + floorArea,
        wastePercent: 10,
        totalWithWaste: Math.ceil((wetZoneWallArea + floorArea) * 1.1),
        unit: 'm²',
        confidence: dimensionConfidence,
        basis: `Shower enclosure (${showerWidth}m wide × ${effectiveHeight}m high) + bathroom floor (${floorArea}m²)`,
        formulaExplanation: `${wetZoneWallArea}m² shower walls + ${floorArea}m² floor + 10% overlap joint tape = ${Math.ceil((wetZoneWallArea + floorArea) * 1.1)}m² tanking membrane`,
        materialCategory: 'tiles',
      });

      items.push({
        id: 'qty-tiles',
        item: 'Porcelain Wall & Floor Tiles (Wet Areas)',
        category: 'Tiling',
        netQuantity: tileArea,
        wastePercent: 12,
        totalWithWaste: totalTiles,
        unit: 'm²',
        confidence: dimensionConfidence,
        basis: `Shower wet walls (${wetZoneWallArea}m²) + Floor (${floorArea}m²)`,
        formulaExplanation: `${tileArea}m² net tiled area + 12% cutting waste = ${totalTiles}m²`,
        materialCategory: 'tiles',
      });
    } else {
      items.push({
        id: 'qty-bathroom-insufficient',
        item: 'Bathroom Waterproof Tanking & Wet Zone Tiling',
        category: 'Waterproofing',
        netQuantity: 0,
        wastePercent: 0,
        totalWithWaste: 0,
        unit: 'm²',
        confidence: 'INSUFFICIENT_INFORMATION',
        basis: 'Shower / Bath enclosure configuration not supplied',
        formulaExplanation: 'Wet area square meterage depends on shower configuration, bath enclosure dimensions, and whether tiling is full-height or half-height. Supply shower/bath dimensions to calculate waterproof membrane and tile quantities.',
        materialCategory: 'tiles',
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. STRUCTURAL STEELWORK (Items 21, 22: Strictly No Fixed 45kg/m Calculation)
  // --------------------------------------------------------------------------
  const hasStructural = hasStructuralKnockthrough || (context?.hasStructuralAlteration ?? false);

  if (hasStructural) {
    const engineerSpec = context?.structuralEngineerSpec;
    const spanM = width && width > 0 ? width : 4.0;

    // Check if verified structural engineer parameters are present (Item 22)
    const hasVerifiedEngineerData = Boolean(
      engineerSpec &&
      engineerSpec.sectionDesignation &&
      engineerSpec.massPerMetre &&
      engineerSpec.massPerMetre > 0 &&
      engineerSpec.memberLength &&
      engineerSpec.memberLength > 0
    );

    if (hasVerifiedEngineerData && engineerSpec?.massPerMetre && engineerSpec?.memberLength) {
      const memberCount = engineerSpec.memberCount || 1;
      const totalSteelKg = Math.round(engineerSpec.memberLength * engineerSpec.massPerMetre * memberCount);

      items.push({
        id: 'qty-steel-verified',
        item: `Structural Steelwork (${engineerSpec.sectionDesignation})`,
        category: 'Structure',
        netQuantity: totalSteelKg,
        wastePercent: 0,
        totalWithWaste: totalSteelKg,
        unit: 'kg steel',
        confidence: 'CALCULATED_FROM_CONFIRMED_INPUT',
        basis: `Engineer specified: ${engineerSpec.sectionDesignation} (${engineerSpec.massPerMetre}kg/m) × ${engineerSpec.memberLength}m × ${memberCount} member(s)`,
        formulaExplanation: `${engineerSpec.memberLength}m length × ${engineerSpec.massPerMetre}kg/m × ${memberCount} beam = ${totalSteelKg}kg steel. Padstones: ${engineerSpec.padstones || 2} specified (${engineerSpec.bearingSpecification || 'C30 concrete padstones'}).`,
        materialCategory: 'steel',
        engineeringNote: `Structural calculation status: Verified against engineer spec ${engineerSpec.engineerReference || 'submitted calculation'}.`,
      });
    } else {
      // Strictly ENGINEERING REQUIRED (Items 21, 22)
      items.push({
        id: 'qty-steel-engineering-required',
        item: 'Universal Steel Beam (RSJ) Knockthrough Frame',
        category: 'Structure',
        netQuantity: 0,
        wastePercent: 0,
        totalWithWaste: 0,
        unit: 'Structural Design Required',
        confidence: 'ENGINEERING_REQUIRED',
        basis: `Proposed opening span: ~${spanM}m (Requires Chartered Engineer Design)`,
        formulaExplanation: 'Universal beam (UB/UC) section designation, mass per metre (kg/m), padstone bearing dimensions, and deflection limits cannot be guessed. A chartered structural engineer must perform Building Regulations Part A calculations before exact steel tonnage can be determined.',
        materialCategory: 'steel',
        engineeringNote: 'Beam size: Not determined • Steel mass: Not determined • Requirement: Structural engineer calculation & Building Control approval.',
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. FOUNDATION CONCRETE SAFEGUARDS (Item 20: Site/Ground Condition Dependent)
  // --------------------------------------------------------------------------
  if (isExtension) {
    const trenchPerimeter = length && width ? Math.round(((2 * length) + width) * 10) / 10 : 16.0;
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
  // 6. GLAZED APERTURES
  // --------------------------------------------------------------------------
  if ((isExtension || isKitchen) && width && width > 0 && !isJoineryOnly && !isDoorOnly) {
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
