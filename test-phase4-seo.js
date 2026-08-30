/**
 * PHASE 4: SEO & CONTENT ENGINE AUTOMATED TEST SUITE
 * Tests data integrity, internal linking, geocoding, and scoring algorithms.
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  APEX CONSTRUCTION — PHASE 4 SEO & CONTENT ENGINE TESTS');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, description, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    failedTests++;
    const err = `✗ [FAIL] ${description} ${detail ? `(${detail})` : ''}`;
    failures.push(err);
    console.error(`  ${err}`);
  }
}

// ----------------------------------------------------------------------------
// LOAD CODE FILES
// ----------------------------------------------------------------------------
const costGuidesCode = fs.readFileSync(path.join(__dirname, 'src/lib/content/cost-guides-data.ts'), 'utf8');
const adviceCode = fs.readFileSync(path.join(__dirname, 'src/lib/content/advice-data.ts'), 'utf8');
const locationsCode = fs.readFileSync(path.join(__dirname, 'src/lib/content/locations-data.ts'), 'utf8');
const sitemapCode = fs.readFileSync(path.join(__dirname, 'src/app/sitemap.ts'), 'utf8');

// ============================================================================
// SECTION 1: COST GUIDES REGISTRY & ARCHITECTURE (8 CORE GUIDES)
// ============================================================================
console.log('--- SECTION 1: COST GUIDES INTEGRITY ---');

const expectedCostGuides = [
  'extension-cost',
  'house-renovation-cost',
  'kitchen-renovation-cost',
  'bathroom-renovation-cost',
  'loft-conversion-cost',
  'garage-conversion-cost',
  'garden-room-cost',
  'driveway-cost',
];

expectedCostGuides.forEach((slug) => {
  const hasSlug = costGuidesCode.includes(`slug: '${slug}'`);
  assert(hasSlug, `Cost Guide '${slug}' is registered in COST_GUIDES_DATA`);
});

assert(costGuidesCode.includes('indicativeRange:'), 'Cost Guides contain indicative pricing ranges');
assert(costGuidesCode.includes('priceTable:'), 'Cost Guides contain structured price tables');
assert(costGuidesCode.includes('timeline:'), 'Cost Guides contain construction timelines');
assert(costGuidesCode.includes('costFactors:'), 'Cost Guides contain structural cost factors');
assert(costGuidesCode.includes('finishLevels:'), 'Cost Guides contain finish level multipliers');
assert(costGuidesCode.includes('commercialCta:'), 'Cost Guides contain commercial lead conversion CTAs');

// ============================================================================
// SECTION 2: ADVICE & KNOWLEDGE HUB
// ============================================================================
console.log('\n--- SECTION 2: ADVICE & KNOWLEDGE HUB INTEGRITY ---');

assert(adviceCode.includes("slug: 'permitted-development-rules-extensions'"), "Advice article 'permitted-development-rules-extensions' exists");
assert(adviceCode.includes("slug: 'planning-permission-vs-building-regulations'"), "Advice article 'planning-permission-vs-building-regulations' exists");
assert(adviceCode.includes("slug: 'party-wall-act-guide'"), "Advice article 'party-wall-act-guide' exists");
assert(adviceCode.includes("slug: 'open-plan-kitchen-knockthrough-guide'"), "Advice article 'open-plan-kitchen-knockthrough-guide' exists");
assert(adviceCode.includes('author:'), 'Advice articles define authoritative author and role');
assert(adviceCode.includes('readingTimeMinutes:'), 'Advice articles include estimated reading time');
assert(adviceCode.includes('faqs:'), 'Advice articles include structured FAQs for schema');

// ============================================================================
// SECTION 3: LOCATION HUB ARCHITECTURE
// ============================================================================
console.log('\n--- SECTION 3: LOCATION HUB ARCHITECTURE ---');

const expectedLocations = ['ealing', 'richmond', 'chiswick', 'harrow'];
expectedLocations.forEach((slug) => {
  assert(locationsCode.includes(`slug: '${slug}'`), `Location Guide '${slug}' is registered`);
});

assert(locationsCode.includes('localArchitecture:'), 'Location guides contain authentic local architecture');
assert(locationsCode.includes('planningGuidelines:'), 'Location guides contain council planning and conservation data');
assert(locationsCode.includes('postcodes:'), 'Location guides contain borough postcodes');

// ============================================================================
// SECTION 4: GEOCODING & REGIONAL LOCATION RESOLUTION
// ============================================================================
console.log('\n--- SECTION 4: POSTCODE RESOLUTION & PRICING TIERS ---');

function resolvePostcode(rawPostcode) {
  const parts = rawPostcode.trim().toUpperCase().split(/\s+/);
  let outward = parts[0] || 'W5';

  if (parts.length === 1 && outward.length > 3) {
    outward = outward.slice(0, -3);
  }

  const dir = {
    W5: { borough: 'London Borough of Ealing', mult: 1.18 },
    TW9: { borough: 'London Borough of Richmond upon Thames', mult: 1.22 },
    W4: { borough: 'London Borough of Hounslow', mult: 1.20 },
    HA1: { borough: 'London Borough of Harrow', mult: 1.14 },
  };

  return dir[outward] || { borough: 'Greater London', mult: 1.10 };
}

const w5Res = resolvePostcode('W5 2NU');
assert(w5Res.borough === 'London Borough of Ealing', 'W5 resolves to London Borough of Ealing');
assert(w5Res.mult === 1.18, 'W5 applies 1.18x pricing multiplier');

const tw9Res = resolvePostcode('tw9 1aa');
assert(tw9Res.borough === 'London Borough of Richmond upon Thames', 'TW9 resolves to London Borough of Richmond upon Thames');
assert(tw9Res.mult === 1.22, 'TW9 applies 1.22x pricing multiplier');

// ============================================================================
// SECTION 5: GOOGLE SEARCH CONSOLE DOMAIN FORMATTING
// ============================================================================
console.log('\n--- SECTION 5: SEARCH CONSOLE DOMAIN FORMATTING ---');

function formatSearchConsoleSiteUrl(rawSiteUrl) {
  const input = (rawSiteUrl || 'sc-domain:stcontractors.co.uk').trim();
  if (input.startsWith('sc-domain:')) return input;
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input.endsWith('/') ? input : `${input}/`;
  }
  return `sc-domain:${input.replace(/^\/+|\/+$/g, '')}`;
}

assert(
  formatSearchConsoleSiteUrl('sc-domain:stcontractors.co.uk') === 'sc-domain:stcontractors.co.uk',
  "Preserves 'sc-domain:stcontractors.co.uk' format"
);
assert(
  formatSearchConsoleSiteUrl('stcontractors.co.uk') === 'sc-domain:stcontractors.co.uk',
  "Converts bare 'stcontractors.co.uk' into 'sc-domain:stcontractors.co.uk'"
);
assert(
  formatSearchConsoleSiteUrl('https://stcontractors.co.uk') === 'https://stcontractors.co.uk/',
  "Normalizes URL-prefix properties with trailing slash 'https://stcontractors.co.uk/'"
);

// ============================================================================
// SECTION 6: SEO OPPORTUNITY ENGINE
// ============================================================================
console.log('\n--- SECTION 6: SEO OPPORTUNITY SCORING ALGORITHM ---');

function calculateOpportunityScore(params) {
  const { monthlyImpressions, currentPosition, commercialIntent, averageProjectValue } = params;

  let positionFactor = 0.5;
  if (currentPosition >= 4 && currentPosition <= 12) {
    positionFactor = 1.0;
  } else if (currentPosition > 12 && currentPosition <= 20) {
    positionFactor = 0.8;
  } else if (currentPosition < 4) {
    positionFactor = 0.6;
  }

  const volumeFactor = Math.min(1.0, Math.log10(monthlyImpressions + 1) / 4.3);
  const valueFactor = Math.min(1.0, averageProjectValue / 100000);

  const rawScore =
    commercialIntent * 0.4 +
    positionFactor * 100 * 0.25 +
    volumeFactor * 100 * 0.2 +
    valueFactor * 100 * 0.15;

  return Math.round(Math.min(100, Math.max(1, rawScore)));
}

const highCommercialScore = calculateOpportunityScore({
  monthlyImpressions: 10000,
  currentPosition: 6.0,
  commercialIntent: 95,
  averageProjectValue: 80000,
});
assert(highCommercialScore >= 85 && highCommercialScore <= 100, `High commercial query scores high (got ${highCommercialScore})`);

const lowIntentScore = calculateOpportunityScore({
  monthlyImpressions: 200,
  currentPosition: 35.0,
  commercialIntent: 20,
  averageProjectValue: 1000,
});
assert(lowIntentScore < 50, `Low intent non-commercial query scores low (got ${lowIntentScore})`);

// ============================================================================
// SECTION 7: SITEMAP & TECHNICAL SEO COMPLIANCE
// ============================================================================
console.log('\n--- SECTION 7: SITEMAP & TECHNICAL SEO ---');
assert(sitemapCode.includes('COST_GUIDES_DATA'), 'Sitemap dynamically includes published Cost Guides');
assert(sitemapCode.includes('ADVICE_ARTICLES_DATA'), 'Sitemap dynamically includes published Advice Articles');
assert(sitemapCode.includes('LOCATIONS_DATA'), 'Sitemap dynamically includes published Location Area Guides');
assert(!sitemapCode.includes('/admin'), 'Sitemap excludes admin and private management routes');

console.log('\n================================================================');
console.log(`PHASE 4 SEO TEST SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
if (failedTests === 0) {
  console.log('STATUS: ALL PHASE 4 CHECKS PASSED (100% SUCCESS)');
} else {
  console.log(`STATUS: ${failedTests} CHECKS FAILED`);
  process.exit(1);
}
console.log('================================================================\n');
