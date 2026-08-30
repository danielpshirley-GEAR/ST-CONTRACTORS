/**
 * QUANTITY ENGINE
 * Pure mathematical formulas and UK construction trade quantity rules.
 * Conforms to GEMINI.md Section 7 & BUILD_SPEC.md Section 20-21.
 * 
 * AI IS NEVER USED FOR DETERMINISTIC CALCULATIONS.
 */

// ----------------------------------------------------------------------------
// UNIT CONVERSION HELPERS
// ----------------------------------------------------------------------------

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function metersToFeet(meters: number): number {
  return meters / 0.3048;
}

export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

export function mmToMeters(mm: number): number {
  return mm / 1000;
}

export function sqFtToSqMeters(sqFt: number): number {
  return sqFt * 0.092903;
}

export function sqMetersToSqFt(sqMeters: number): number {
  return sqMeters / 0.092903;
}

export function applyWaste(baseQuantity: number, wastePercent: number): { totalWithWaste: number; wasteUnits: number } {
  const safePercent = Math.max(0, Math.min(100, wastePercent || 0));
  const wasteUnits = baseQuantity * (safePercent / 100);
  const totalWithWaste = baseQuantity + wasteUnits;
  return {
    totalWithWaste: Math.ceil(totalWithWaste),
    wasteUnits: Math.ceil(wasteUnits),
  };
}

// ----------------------------------------------------------------------------
// 1. BRICK CALCULATOR FORMULAS
// Standard UK Metric Brick: 215mm x 102.5mm x 65mm with 10mm mortar joint = 60 bricks/m2 single skin
// ----------------------------------------------------------------------------
export function calculateBricks(
  lengthM: number,
  heightM: number,
  wallType: 'single_skin' | 'double_skin' | 'cavity' = 'single_skin',
  deductionsM2: number = 0,
  wastePercent: number = 10
) {
  const grossAreaM2 = Math.max(0, lengthM * heightM);
  const netAreaM2 = Math.max(0, grossAreaM2 - Math.max(0, deductionsM2));
  
  // 60 bricks per m2 for single skin (half brick thick), 120 per m2 for double skin / solid 9" brick wall
  const bricksPerM2 = wallType === 'single_skin' ? 60 : 120;
  const baseBricks = netAreaM2 * bricksPerM2;
  const { totalWithWaste: totalBricks, wasteUnits: wasteBricks } = applyWaste(baseBricks, wastePercent);

  // Standard mortar assumptions: approx 0.055 tonnes (55kg) of mortar per m2 of single skin brickwork
  // In bags: approx 1 x 25kg bag of building sand + 0.25 bag of cement per 50 bricks
  const mortarSandBags = Math.ceil((totalBricks / 50) * 1);
  const cementBags = Math.ceil((totalBricks / 50) * 0.25);

  return {
    netAreaM2: Math.round(netAreaM2 * 100) / 100,
    baseBricks: Math.ceil(baseBricks),
    totalBricks,
    wasteBricks,
    mortarSandBags,
    cementBags,
  };
}

// ----------------------------------------------------------------------------
// 2. BLOCKWORK CALCULATOR FORMULAS
// Standard UK Block: 440mm x 215mm x 100mm with 10mm mortar joint = 10 blocks/m2
// ----------------------------------------------------------------------------
export function calculateBlocks(
  lengthM: number,
  heightM: number,
  deductionsM2: number = 0,
  wastePercent: number = 10
) {
  const grossAreaM2 = Math.max(0, lengthM * heightM);
  const netAreaM2 = Math.max(0, grossAreaM2 - Math.max(0, deductionsM2));
  
  const blocksPerM2 = 10;
  const baseBlocks = netAreaM2 * blocksPerM2;
  const { totalWithWaste: totalBlocks, wasteUnits: wasteBlocks } = applyWaste(baseBlocks, wastePercent);

  // Mortar for blocks: approx 1 x 25kg bag sand per 12 blocks
  const mortarSandBags = Math.ceil(totalBlocks / 12);
  const cementBags = Math.ceil(totalBlocks / 48);

  return {
    netAreaM2: Math.round(netAreaM2 * 100) / 100,
    baseBlocks: Math.ceil(baseBlocks),
    totalBlocks,
    wasteBlocks,
    mortarSandBags,
    cementBags,
  };
}

// ----------------------------------------------------------------------------
// 3. CONCRETE VOLUME CALCULATOR FORMULAS
// Length (m) x Width (m) x Depth (m) = m3
// ----------------------------------------------------------------------------
export function calculateConcrete(
  lengthM: number,
  widthM: number,
  depthM: number,
  wastePercent: number = 10
) {
  const baseVolumeM3 = Math.max(0, lengthM * widthM * depthM);
  const { totalWithWaste: totalVolumeM3 } = applyWaste(baseVolumeM3 * 100, wastePercent);
  const finalVolumeM3 = Math.round((totalVolumeM3 / 100) * 100) / 100;

  // 1 m3 of wet concrete = approx 2.4 tonnes = approx 108 x 20kg pre-mix bags or ready-mix lorry delivery
  const preMixBags20kg = Math.ceil(finalVolumeM3 * 108);
  const ballastTonnes = Math.round(finalVolumeM3 * 1.8 * 10) / 10;
  const cementBags25kg = Math.ceil(finalVolumeM3 * 14);

  return {
    baseVolumeM3: Math.round(baseVolumeM3 * 100) / 100,
    finalVolumeM3,
    preMixBags20kg,
    ballastTonnes,
    cementBags25kg,
    isReadyMixRecommended: finalVolumeM3 >= 1.5,
  };
}

// ----------------------------------------------------------------------------
// 4. TILE & GROUT CALCULATOR FORMULAS
// Area (m2), Tile Length (mm), Tile Width (mm), Grout Joint (mm)
// ----------------------------------------------------------------------------
export function calculateTiles(
  areaM2: number,
  tileLengthMm: number = 600,
  tileWidthMm: number = 300,
  groutJointMm: number = 3,
  wastePercent: number = 10
) {
  const safeArea = Math.max(0.1, areaM2);
  const tileAreaM2 = (Math.max(10, tileLengthMm) / 1000) * (Math.max(10, tileWidthMm) / 1000);
  const baseTileCount = Math.ceil(safeArea / tileAreaM2);
  
  const { totalWithWaste: totalTiles, wasteUnits: wasteTiles } = applyWaste(baseTileCount, wastePercent);
  const boxCount = Math.ceil(totalTiles / Math.max(1, Math.round(1.44 / tileAreaM2)));

  // Adhesive bags: approx 1 x 20kg bag covers 4.5m2
  const adhesiveBags20kg = Math.ceil(safeArea / 4.5);

  // Grout formula kg = ((TileL + TileW) / (TileL * TileW)) * TileThickness * JointWidth * Density (1.6) * Area
  const tileThicknessMm = 9;
  const groutKg = Math.ceil(
    (((tileLengthMm + tileWidthMm) / (tileLengthMm * tileWidthMm)) * tileThicknessMm * groutJointMm * 1.6 * safeArea) * 1.15
  );
  const groutBags5kg = Math.ceil(groutKg / 5);

  return {
    netAreaM2: Math.round(safeArea * 100) / 100,
    baseTileCount,
    totalTiles,
    wasteTiles,
    boxCount,
    adhesiveBags20kg,
    groutKg,
    groutBags5kg,
  };
}

// ----------------------------------------------------------------------------
// 5. PAINT & COVERAGE CALCULATOR FORMULAS
// Wall Area (m2) - Door/Window Deductions (m2), Number of Coats, Coverage (12m2/L)
// ----------------------------------------------------------------------------
export function calculatePaint(
  roomLengthM: number,
  roomWidthM: number,
  ceilingHeightM: number = 2.4,
  doorWindowDeductionsM2: number = 4,
  coats: number = 2,
  includeCeiling: boolean = true
) {
  const perimeterM = (Math.max(0, roomLengthM) + Math.max(0, roomWidthM)) * 2;
  const wallAreaGross = perimeterM * Math.max(1.8, ceilingHeightM);
  const wallAreaNet = Math.max(0, wallAreaGross - Math.max(0, doorWindowDeductionsM2));
  const ceilingArea = includeCeiling ? Math.max(0, roomLengthM * roomWidthM) : 0;

  const totalAreaToPaintM2 = wallAreaNet + ceilingArea;
  const totalCoatsArea = totalAreaToPaintM2 * Math.max(1, coats);

  // Standard UK trade emulsion coverage: approx 12 m2 per litre
  const litresRequired = Math.ceil(totalCoatsArea / 12);
  const fiveLitreTins = Math.ceil(litresRequired / 5);
  const twoPointFiveLitreTins = Math.ceil((litresRequired % 5) / 2.5);

  return {
    wallAreaNetM2: Math.round(wallAreaNet * 10) / 10,
    ceilingAreaM2: Math.round(ceilingArea * 10) / 10,
    totalAreaToPaintM2: Math.round(totalAreaToPaintM2 * 10) / 10,
    litresRequired,
    fiveLitreTins,
    twoPointFiveLitreTins,
  };
}

// ----------------------------------------------------------------------------
// 6. PLASTERBOARD & SKIM CALCULATOR FORMULAS
// Standard UK Plasterboard Sheet: 2400mm x 1200mm = 2.88m2
// Thistle MultiFinish 25kg bag: approx 10m2 coverage at 2mm thickness
// ----------------------------------------------------------------------------
export function calculatePlasterboardAndSkim(
  areaM2: number,
  wastePercent: number = 10
) {
  const safeArea = Math.max(0.5, areaM2);
  const sheetAreaM2 = 2.88; // 2.4m x 1.2m
  const baseSheets = Math.ceil(safeArea / sheetAreaM2);
  const { totalWithWaste: totalSheets, wasteUnits: wasteSheets } = applyWaste(baseSheets, wastePercent);

  // Plaster Multi-Finish bags (25kg covers approx 10m2 of wall skim)
  const skimBags25kg = Math.ceil(safeArea / 10);
  const scrimTapeRolls90m = Math.ceil(totalSheets / 12);
  const drywallScrewsBox1000 = Math.ceil(totalSheets / 20);

  return {
    areaM2: Math.round(safeArea * 10) / 10,
    baseSheets,
    totalSheets,
    wasteSheets,
    skimBags25kg,
    scrimTapeRolls90m,
    drywallScrewsBox1000,
  };
}

// ----------------------------------------------------------------------------
// 7. PATIO & SUB-BASE CALCULATOR FORMULAS
// Area (m2), Slab Dimensions (e.g. 900x600 or 600x600mm), 100mm Sub-base
// ----------------------------------------------------------------------------
export function calculatePatio(
  lengthM: number,
  widthM: number,
  slabType: 'porcelain_900_600' | 'porcelain_600_600' | 'sandstone_mixed' = 'porcelain_900_600',
  wastePercent: number = 10
) {
  const areaM2 = Math.max(0.5, lengthM * widthM);
  let slabAreaM2 = 0.54; // 900x600mm default
  if (slabType === 'porcelain_600_600') slabAreaM2 = 0.36;
  if (slabType === 'sandstone_mixed') slabAreaM2 = 0.45;

  const baseSlabs = Math.ceil(areaM2 / slabAreaM2);
  const { totalWithWaste: totalSlabs, wasteUnits: wasteSlabs } = applyWaste(baseSlabs, wastePercent);

  // Sub-base: 100mm compacted MOT Type 1 aggregate = 0.1m x area x 2.2 tonnes/m3
  const motType1Tonnes = Math.round(areaM2 * 0.1 * 2.2 * 10) / 10;
  const motBulkBags850kg = Math.ceil((motType1Tonnes * 1000) / 850);

  // Sharp sand & cement full mortar bed (50mm depth):
  const sharpSandBulkBags = Math.ceil((areaM2 * 0.05 * 1.8 * 1000) / 850);
  const cementBags25kg = Math.ceil(areaM2 * 1.2);
  const primerSBRTubs = Math.ceil(areaM2 / 30); // Porcelain bonding primer

  return {
    areaM2: Math.round(areaM2 * 10) / 10,
    baseSlabs,
    totalSlabs,
    wasteSlabs,
    motType1Tonnes,
    motBulkBags850kg,
    sharpSandBulkBags,
    cementBags25kg,
    primerSBRTubs,
  };
}

// ----------------------------------------------------------------------------
// 8. DECKING BOARDS & JOISTS CALCULATOR FORMULAS
// Area (m2), Board Length (3.6m or 4.8m), Width (145mm)
// ----------------------------------------------------------------------------
export function calculateDecking(
  lengthM: number,
  widthM: number,
  boardLengthM: number = 3.6,
  boardWidthMm: number = 145,
  wastePercent: number = 10
) {
  const areaM2 = Math.max(0.5, lengthM * widthM);
  const boardWidthM = boardWidthMm / 1000;
  const boardAreaM2 = boardLengthM * boardWidthM;
  
  const baseBoards = Math.ceil(areaM2 / boardAreaM2);
  const { totalWithWaste: totalBoards, wasteUnits: wasteBoards } = applyWaste(baseBoards, wastePercent);

  // Joist timber (47x150mm C24 treated timber at 400mm centers):
  const joistRuns = Math.ceil(lengthM / 0.4) + 1;
  const totalJoistLinearM = Math.ceil(joistRuns * widthM * 1.15);
  const deckScrewsClipsPack250 = Math.ceil((totalBoards * 8) / 250);
  const weedMembraneM2 = Math.ceil(areaM2 * 1.15);

  return {
    areaM2: Math.round(areaM2 * 10) / 10,
    baseBoards,
    totalBoards,
    wasteBoards,
    totalJoistLinearM,
    deckScrewsClipsPack250,
    weedMembraneM2,
  };
}

// ----------------------------------------------------------------------------
// 9. FENCE PANELS & POSTS CALCULATOR FORMULAS
// Fence Run Length (m), Panel Width (1.83m / 6ft)
// ----------------------------------------------------------------------------
export function calculateFencing(
  runLengthM: number,
  panelHeightFt: number = 6
) {
  const safeLengthM = Math.max(1, runLengthM);
  const panelWidthM = 1.83; // Standard 6ft UK panel width
  const panelsCount = Math.ceil(safeLengthM / panelWidthM);
  const postsCount = panelsCount + 1;
  const gravelBoardsCount = panelsCount;
  
  // Postcrete: 1.5 to 2 x 20kg bags per post
  const postcreteBags20kg = postsCount * 2;
  const fixingClipsPacks = Math.ceil((panelsCount * 4) / 20);

  return {
    runLengthM: Math.round(safeLengthM * 10) / 10,
    panelsCount,
    postsCount,
    gravelBoardsCount,
    postcreteBags20kg,
    fixingClipsPacks,
  };
}

// ----------------------------------------------------------------------------
// 10. GRAVEL & AGGREGATE CALCULATOR FORMULAS
// Area (m2) x Depth (m, default 0.05m = 50mm) x Density (1.8t/m3)
// ----------------------------------------------------------------------------
export function calculateGravel(
  lengthM: number,
  widthM: number,
  depthMm: number = 50
) {
  const areaM2 = Math.max(0.5, lengthM * widthM);
  const depthM = Math.max(20, depthMm) / 1000;
  const volumeM3 = areaM2 * depthM;
  
  // Decorative gravel bulk density is approx 1.8 tonnes per m3
  const tonnesRequired = Math.round(volumeM3 * 1.8 * 100) / 100;
  const bulkBags850kg = Math.ceil((tonnesRequired * 1000) / 850);
  const smallBags25kg = Math.ceil((tonnesRequired * 1000) / 25);
  const weedMembraneM2 = Math.ceil(areaM2 * 1.15);

  return {
    areaM2: Math.round(areaM2 * 10) / 10,
    volumeM3: Math.round(volumeM3 * 100) / 100,
    tonnesRequired,
    bulkBags850kg,
    smallBags25kg,
    weedMembraneM2,
  };
}

// ----------------------------------------------------------------------------
// 11. TURF & TOPSOIL CALCULATOR FORMULAS
// Area (m2) = Turf rolls (1m2 each). Topsoil depth (default 50mm = 0.05m)
// ----------------------------------------------------------------------------
export function calculateTurf(
  lengthM: number,
  widthM: number,
  topsoilDepthMm: number = 50,
  wastePercent: number = 10
) {
  const areaM2 = Math.max(1, lengthM * widthM);
  const baseRolls = Math.ceil(areaM2);
  const { totalWithWaste: totalRolls, wasteUnits: wasteRolls } = applyWaste(baseRolls, wastePercent);

  // Topsoil: area x depth x 1.4t/m3 density
  const depthM = Math.max(0, topsoilDepthMm) / 1000;
  const topsoilM3 = areaM2 * depthM;
  const topsoilTonnes = Math.round(topsoilM3 * 1.4 * 10) / 10;
  const topsoilBulkBags850kg = Math.ceil((topsoilTonnes * 1000) / 850);

  return {
    areaM2: Math.round(areaM2 * 10) / 10,
    baseRolls,
    totalRolls,
    wasteRolls,
    topsoilM3: Math.round(topsoilM3 * 100) / 100,
    topsoilTonnes,
    topsoilBulkBags850kg,
  };
}
