/**
 * Scope & Deterministic Quantity Calculation Engine
 * Pure mathematical formulas with material-specific waste factors.
 * Complies with GEMINI.md Section 7 & Master Visualiser Rebuild Specification.
 */

import { CalculatedQuantityItem, ProjectSpace, ProjectCategoryType } from '@/types/visualiser-scope';

export function calculateProjectQuantities(
  spaces: ProjectSpace[],
  projectTypes: ProjectCategoryType[],
  hasStructuralKnockthrough: boolean = false
): CalculatedQuantityItem[] {
  const items: CalculatedQuantityItem[] = [];

  // 1. Primary Space Area Calculations
  const primarySpace = spaces.find((s) => s.isPrimary) || spaces[0];
  const hasDimensions = Boolean(
    primarySpace &&
    primarySpace.lengthM.value > 0 &&
    primarySpace.widthM.value > 0
  );

  const length = hasDimensions ? primarySpace.lengthM.value : 0;
  const width = hasDimensions ? primarySpace.widthM.value : 0;
  const height = (primarySpace && primarySpace.heightM.value > 0) ? primarySpace.heightM.value : 2.4;
  const floorArea = hasDimensions ? Math.round(length * width * 10) / 10 : 0;

  const isKitchen = projectTypes.includes('kitchen-renovation') || projectTypes.includes('extension');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isExtension = projectTypes.includes('extension');
  const isLoft = projectTypes.includes('loft-conversion');
  const isGarden = projectTypes.includes('garden-room');
  const isLandscaping = projectTypes.includes('landscaping') || projectTypes.includes('driveway');

  // --------------------------------------------------------------------------
  // FLOORING QUANTITY
  // --------------------------------------------------------------------------
  if (floorArea > 0) {
    const flooringWaste = 10; // Standard 10% for straight laid engineered timber / porcelain
    const totalFlooring = Math.round((floorArea * (1 + flooringWaste / 100)) * 10) / 10;
    items.push({
      id: 'qty-flooring',
      item: 'Finished Flooring & Subfloor Underlay',
      category: 'Finishes',
      netQuantity: floorArea,
      wastePercent: flooringWaste,
      totalWithWaste: Math.ceil(totalFlooring),
      unit: 'm²',
      confidence: primarySpace.lengthM.status === 'confirmed' ? 'calculated' : 'estimated',
      basis: `Based on ${primarySpace.name} (${length}m × ${width}m)`,
      formulaExplanation: `${length}m × ${width}m = ${floorArea}m² net floor area + ${flooringWaste}% cutting/layout waste = ${totalFlooring}m² (Order ${Math.ceil(totalFlooring)}m²)`,
      materialCategory: 'flooring',
    });
  } else {
    items.push({
      id: 'qty-flooring-unknown',
      item: 'Finished Flooring',
      category: 'Finishes',
      netQuantity: 0,
      wastePercent: 10,
      totalWithWaste: 0,
      unit: 'm²',
      confidence: 'unknown',
      basis: 'Room dimensions not yet supplied',
      formulaExplanation: 'Requires confirmed room length and width to calculate exact flooring square meterage and waste allowance.',
      materialCategory: 'flooring',
    });
  }

  // --------------------------------------------------------------------------
  // WALL SKIRTING & PERIMETER
  // --------------------------------------------------------------------------
  if (floorArea > 0 && !isBathroom) {
    const perimeter = 2 * (length + width);
    const estimatedDoorOpenings = 2.0; // Deduct approx 2.0m for doorway/bifold opening
    const netSkirting = Math.max(0, Math.round((perimeter - estimatedDoorOpenings) * 10) / 10);
    const skirtingWaste = 10;
    const totalSkirting = Math.round((netSkirting * 1.1) * 10) / 10;

    items.push({
      id: 'qty-skirting',
      item: 'Skirting Boards & Architraves',
      category: 'Carpentry',
      netQuantity: netSkirting,
      wastePercent: skirtingWaste,
      totalWithWaste: Math.ceil(totalSkirting),
      unit: 'linear metres (m)',
      confidence: primarySpace.lengthM.status === 'confirmed' ? 'calculated' : 'estimated',
      basis: `Perimeter of ${primarySpace.name} minus 2m doorway allowance`,
      formulaExplanation: `(2 × [${length}m + ${width}m]) - 2m opening = ${netSkirting}m net run + 10% offcut waste = ${totalSkirting}m (Order ${Math.ceil(totalSkirting)}m)`,
      materialCategory: 'skirting',
    });
  }

  // --------------------------------------------------------------------------
  // WALL PLASTERBOARD & EMULSION PAINT
  // --------------------------------------------------------------------------
  if (floorArea > 0) {
    const perimeter = 2 * (length + width);
    const grossWallArea = Math.round(perimeter * height * 10) / 10;
    const estimatedOpenings = isExtension ? 8.0 : 4.0; // Deduct for windows & glazed doors
    const netWallArea = Math.max(0, Math.round((grossWallArea - estimatedOpenings) * 10) / 10);
    const totalPlasterboardArea = Math.round(netWallArea * 1.1 * 10) / 10;
    const boardSheets = Math.ceil(totalPlasterboardArea / 2.88); // 2.4m x 1.2m sheet = 2.88m2

    items.push({
      id: 'qty-plasterboard',
      item: 'Plasterboard Wall Linings (2.4m × 1.2m sheets)',
      category: 'Drylining',
      netQuantity: netWallArea,
      wastePercent: 10,
      totalWithWaste: boardSheets,
      unit: 'boards (2.88m²/sheet)',
      confidence: primarySpace.lengthM.status === 'confirmed' ? 'calculated' : 'estimated',
      basis: `${netWallArea}m² net wall area at ${height}m ceiling height`,
      formulaExplanation: `${perimeter}m perimeter × ${height}m height minus ${estimatedOpenings}m² openings = ${netWallArea}m² net + 10% waste = ${totalPlasterboardArea}m² ÷ 2.88m²/sheet = ${boardSheets} sheets`,
      materialCategory: 'plasterboard',
    });

    // Paint: 2 coats coverage @ 10m2/Litre
    const paintArea = netWallArea + floorArea; // Walls + ceiling
    const paintLitres = Math.ceil((paintArea * 2) / 10); // 2 coats
    items.push({
      id: 'qty-paint',
      item: 'Trade Emulsion Wall & Ceiling Paint',
      category: 'Decorating',
      netQuantity: paintArea,
      wastePercent: 10,
      totalWithWaste: paintLitres,
      unit: 'Litres (2 coats)',
      confidence: primarySpace.lengthM.status === 'confirmed' ? 'calculated' : 'estimated',
      basis: `${netWallArea}m² walls + ${floorArea}m² ceiling (2 full coats)`,
      formulaExplanation: `(${netWallArea}m² walls + ${floorArea}m² ceiling) × 2 coats ÷ 10m²/L coverage = ${paintLitres} Litres trade emulsion`,
      materialCategory: 'paint',
    });
  }

  // --------------------------------------------------------------------------
  // BATHROOM TANKING & TILES
  // --------------------------------------------------------------------------
  if (isBathroom) {
    if (floorArea > 0) {
      const wetWallArea = Math.round((2 * 1.8 * height) * 10) / 10; // Shower enclosure 2 walls
      const tileArea = Math.round((wetWallArea + floorArea) * 10) / 10;
      const tileWaste = 12; // 12% for large format porcelain cutting around pipes
      const totalTiles = Math.round((tileArea * (1 + tileWaste / 100)) * 10) / 10;

      items.push({
        id: 'qty-tanking',
        item: 'Schlüter Waterproof Tanking Membrane',
        category: 'Waterproofing',
        netQuantity: wetWallArea + floorArea,
        wastePercent: 10,
        totalWithWaste: Math.ceil((wetWallArea + floorArea) * 1.1),
        unit: 'm²',
        confidence: 'calculated',
        basis: `Shower wet zone (${wetWallArea}m² walls) + ${floorArea}m² bathroom floor`,
        formulaExplanation: `${wetWallArea}m² shower enclosure + ${floorArea}m² floor + 10% corner tape overlap = ${Math.ceil((wetWallArea + floorArea) * 1.1)}m² waterproof membrane`,
        materialCategory: 'tiles',
      });

      items.push({
        id: 'qty-tiles',
        item: 'Italian Porcelain Wall & Floor Tiles',
        category: 'Tiling',
        netQuantity: tileArea,
        wastePercent: tileWaste,
        totalWithWaste: Math.ceil(totalTiles),
        unit: 'm²',
        confidence: 'calculated',
        basis: `Wet walls (${wetWallArea}m²) + Floor (${floorArea}m²)`,
        formulaExplanation: `${tileArea}m² net tiled area + ${tileWaste}% cutting & pipe profile waste = ${totalTiles}m² (Order ${Math.ceil(totalTiles)}m²)`,
        materialCategory: 'tiles',
      });
    }
  }

  // --------------------------------------------------------------------------
  // EXTENSION / STRUCTURAL STEELWORK & CONCRETE
  // --------------------------------------------------------------------------
  if (isExtension || hasStructuralKnockthrough) {
    const spanM = width > 0 ? width : 4.0;
    // Structural steel ~45kg/m for 203x203 UC beam
    const steelKg = Math.round(spanM * 45 * 1.15); // +15% bearing plates and splice bolts
    items.push({
      id: 'qty-steel',
      item: 'Universal Column / Beam Structural Steel (RSJ)',
      category: 'Structure',
      netQuantity: spanM,
      wastePercent: 15,
      totalWithWaste: steelKg,
      unit: 'kg structural steel',
      confidence: width > 0 ? 'calculated' : 'estimated',
      basis: `Estimated for ${spanM}m structural opening span`,
      formulaExplanation: `${spanM}m span × 45kg/m UC steel section + 15% concrete padstone bearing plates/bolts = ~${steelKg} kg structural steelwork`,
      materialCategory: 'steel',
    });

    if (isExtension && floorArea > 0) {
      // Trench foundations ~0.6m wide x 1.2m deep around 3 extension sides
      const trenchLength = (2 * length) + width;
      const concreteM3 = Math.round(trenchLength * 0.6 * 1.2 * 10) / 10;
      items.push({
        id: 'qty-concrete',
        item: 'Ready-Mix C25/30 Foundation Trench Concrete',
        category: 'Groundworks',
        netQuantity: concreteM3,
        wastePercent: 5,
        totalWithWaste: Math.round(concreteM3 * 1.05 * 10) / 10,
        unit: 'm³ concrete',
        confidence: 'estimated',
        basis: `Estimated for ${trenchLength}m perimeter trench (0.6m W × 1.2m D)`,
        formulaExplanation: `${trenchLength}m perimeter × 0.6m width × 1.2m depth = ${concreteM3}m³ net + 5% pump waste = ${(concreteM3 * 1.05).toFixed(1)}m³ ready-mix pour`,
        materialCategory: 'concrete',
      });
    }
  }

  // --------------------------------------------------------------------------
  // GLAZING LINEAR SPAN
  // --------------------------------------------------------------------------
  if (isExtension || isKitchen) {
    const glazingWidth = width > 0 ? Math.min(width, 4.5) : 3.6;
    items.push({
      id: 'qty-glazing',
      item: 'Aluminium Slimline Sliding / Bifold Glazed Aperture',
      category: 'Glazing',
      netQuantity: glazingWidth,
      wastePercent: 0,
      totalWithWaste: glazingWidth,
      unit: 'linear metres (m)',
      confidence: width > 0 ? 'calculated' : 'estimated',
      basis: `Sized for ${width > 0 ? `${width}m rear span` : 'standard London rear elevation'}`,
      formulaExplanation: `Designed to span ~${glazingWidth}m aperture with low-E solar control double/triple glazing.`,
      materialCategory: 'glazing',
    });
  }

  return items;
}
