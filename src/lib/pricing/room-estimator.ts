/**
 * Room-by-Room Dynamic Quote Estimator
 * Calculates development cost range, room breakdowns, timelines and disclaimers
 * Conforms to BUILD_SPEC.md & PHASE 2 Specification
 */

import {
  ProjectScopeItem,
  RecommendedWorkItem,
  FullProjectQuoteEstimate,
  ComprehensivePlannerInput,
  RoomBreakdownSummary,
  CategoryBreakdownSummary,
  TimelinePhase,
} from '../ai/types';

export function calculateFullRoomQuote(
  input: ComprehensivePlannerInput,
  items: ProjectScopeItem[],
  acceptedRecommendations: RecommendedWorkItem[] = []
): FullProjectQuoteEstimate {
  // 1. Calculate Active Items Total
  const activeItems = items.filter((item) => item.selected);
  const activeRecs = acceptedRecommendations.filter((rec) => rec.status === 'accepted');

  let rawTotalLow = 0;
  let rawTotalHigh = 0;

  // Track room breakdowns
  const roomMap = new Map<string, { count: number; low: number; high: number }>();
  // Track category breakdowns
  const categoryMap = new Map<string, { low: number; high: number }>();

  activeItems.forEach((item) => {
    rawTotalLow += item.costLow;
    rawTotalHigh += item.costHigh;

    // Room tracking
    const currRoom = roomMap.get(item.areaName) || { count: 0, low: 0, high: 0 };
    currRoom.count += 1;
    currRoom.low += item.costLow;
    currRoom.high += item.costHigh;
    roomMap.set(item.areaName, currRoom);

    // Category tracking
    const currCat = categoryMap.get(item.category) || { low: 0, high: 0 };
    currCat.low += item.costLow;
    currCat.high += item.costHigh;
    categoryMap.set(item.category, currCat);
  });

  activeRecs.forEach((rec) => {
    rawTotalLow += rec.costLow;
    rawTotalHigh += rec.costHigh;

    const currRoom = roomMap.get(rec.areaName) || { count: 0, low: 0, high: 0 };
    currRoom.count += 1;
    currRoom.low += rec.costLow;
    currRoom.high += rec.costHigh;
    roomMap.set(rec.areaName, currRoom);

    const currCat = categoryMap.get(rec.category) || { low: 0, high: 0 };
    currCat.low += rec.costLow;
    currCat.high += rec.costHigh;
    categoryMap.set(rec.category, currCat);
  });

  // 2. Add 10% Contingency Allowance
  const contingencyLow = Math.round(rawTotalLow * 0.1);
  const contingencyHigh = Math.round(rawTotalHigh * 0.1);

  const totalLow = Math.round((rawTotalLow + contingencyLow) / 500) * 500;
  const totalHigh = Math.round((rawTotalHigh + contingencyHigh) / 500) * 500;
  const averageCost = Math.round((totalLow + totalHigh) / 2);

  // 3. Format Room Breakdown summaries
  const roomBreakdowns: RoomBreakdownSummary[] = Array.from(roomMap.entries()).map(
    ([areaName, data]) => ({
      areaName,
      itemCount: data.count,
      costLow: Math.round(data.low / 100) * 100,
      costHigh: Math.round(data.high / 100) * 100,
    })
  );

  // 4. Format Category Breakdown summaries
  const categoryBreakdowns: CategoryBreakdownSummary[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => {
      const avg = (data.low + data.high) / 2;
      const pct = rawTotalHigh > 0 ? Math.round((avg / ((rawTotalLow + rawTotalHigh) / 2)) * 90) : 10;
      return {
        category,
        costLow: Math.round(data.low / 100) * 100,
        costHigh: Math.round(data.high / 100) * 100,
        percentage: pct,
      };
    }
  );
  // Add contingency as category
  categoryBreakdowns.push({
    category: 'Contingency Reserve (10%)',
    costLow: contingencyLow,
    costHigh: contingencyHigh,
    percentage: 10,
  });

  // 5. Calculate Duration in Weeks
  let durationWeeksMin = 3;
  let durationWeeksMax = 6;

  if (totalHigh > 150000) {
    durationWeeksMin = 14;
    durationWeeksMax = 24;
  } else if (totalHigh > 80000) {
    durationWeeksMin = 10;
    durationWeeksMax = 16;
  } else if (totalHigh > 40000) {
    durationWeeksMin = 6;
    durationWeeksMax = 10;
  } else if (totalHigh > 20000) {
    durationWeeksMin = 4;
    durationWeeksMax = 7;
  }

  // 6. Phased Timeline
  const timelinePhases: TimelinePhase[] = [
    {
      phaseNumber: 1,
      name: 'Planning, Survey & Approvals',
      duration: '1–2 weeks',
      description: 'On-site architectural survey, laser measure, structural calcs, and fixed-price scope agreement.',
    },
    {
      phaseNumber: 2,
      name: 'Strip Out & Demolition',
      duration: `${Math.max(2, Math.round(durationWeeksMin * 0.15))} days`,
      description: 'Safe disconnection of utilities, removal of existing fixtures, and skip waste clearance.',
    },
    {
      phaseNumber: 3,
      name: 'Structural Work & Enabling',
      duration: `${Math.max(3, Math.round(durationWeeksMin * 0.25))} days / weeks`,
      description: 'Foundations/groundworks, internal wall removal, steel beam (RSJ) placement, and external opening apertures.',
    },
    {
      phaseNumber: 4,
      name: 'First-Fix Plumbing & Electrics',
      duration: `${Math.max(3, Math.round(durationWeeksMin * 0.2))} days / weeks`,
      description: 'New electrical cabling, water supply pipes, underfloor heating manifolds, and drainage alterations.',
    },
    {
      phaseNumber: 5,
      name: 'Installation & Fit-Out',
      duration: `${Math.max(1, Math.round(durationWeeksMin * 0.25))}–${Math.max(2, Math.round(durationWeeksMax * 0.25))} weeks`,
      description: 'Bespoke cabinetry installation, worktops, sanitaryware, aluminum glazing, and shower enclosures.',
    },
    {
      phaseNumber: 6,
      name: 'Finishing, Snagging & Handover',
      duration: '1–2 weeks',
      description: 'Plaster skimming, painting, floor laying, NICEIC / Gas Safe certification, and 10-year warranty handover.',
    },
  ];

  // 7. Things that may need confirming (BUILD_SPEC.md Section 20)
  const thingsToConfirm: string[] = [
    'Existing structural load calculations & council Building Control sign-off',
    'Underground drainage positions and Thames Water build-over agreement (if extending over public sewer)',
    'Party Wall notices if excavating or inserting steel beams within 3m of neighbor boundary',
    'Condition of existing electrical consumer unit and boiler capacity for new radiators/UFH',
    'Ground bearing condition and trial pit foundation depth inspection',
  ];

  // 8. Confidence Rating (BUILD_SPEC.md Section 39)
  let confidenceRating: FullProjectQuoteEstimate['confidenceRating'] = 'Good';
  const hasDimensions = input.selectedAreas.some((a) => a.lengthMeters && a.widthMeters);
  if (hasDimensions && input.finishLevel && input.postcode) {
    confidenceRating = 'High';
  } else if (input.selectedAreas.some((a) => a.sizeCategory === 'unknown')) {
    confidenceRating = 'Needs Confirmation';
  }

  const projectTitle =
    input.projectType === 'extension'
      ? 'Residential House Extension'
      : input.projectType === 'kitchen'
      ? 'Kitchen Renovation & Open Plan Living'
      : input.projectType === 'bathroom'
      ? 'Luxury Bathroom Renovation'
      : input.projectType === 'full-renovation'
      ? 'Full House Renovation'
      : input.projectType === 'loft-conversion'
      ? 'Dormer Loft Master Suite Conversion'
      : input.projectType === 'garage-conversion'
      ? 'Habitable Garage Conversion'
      : input.projectType === 'garden-room'
      ? 'Contemporary Garden Studio'
      : input.projectType === 'driveway'
      ? 'Resin-Bound / Paved Driveway'
      : input.projectType === 'landscaping'
      ? 'Landscaping & Porcelain Patio'
      : 'Residential Construction Project';

  return {
    projectTitle,
    summaryText: `You're planning a ${input.finishLevel} specification project across ${input.selectedAreas.map((a) => a.name).join(', ')}, focusing on ${input.customerGoals.slice(0, 2).join(' and ') || 'modernization'}.`,
    indicativeCostLow: totalLow,
    indicativeCostHigh: totalHigh,
    averageCost,
    contingencyAmount: contingencyHigh,
    durationWeeksMin,
    durationWeeksMax,
    roomBreakdowns,
    categoryBreakdowns,
    timelinePhases,
    thingsToConfirm,
    confidenceRating,
    isDevelopmentDemo: true,
  };
}
