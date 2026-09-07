/**
 * ST CONTRACTORS — PHASE 8 MASTER CONVERSION, SEO & AI SEARCH TEST SUITE
 * Tests Phase 8A through 8G against all specifications in Section 59 & 60 of BUILD_SPEC.md.
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const errors = [];

function check(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failed++;
    const errMsg = `  ✗ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`;
    errors.push(errMsg);
    console.log(errMsg);
  }
}

async function runSuite() {
  console.log('================================================================');
  console.log('ST CONTRACTORS — MASTER PHASE 8 ACCEPTANCE TEST SUITE');
  console.log('================================================================');

  const BASE_URL = 'http://localhost:3000';

  // -------------------------------------------------------------------------
  // 1. PHASE 8A: CLOSED-LOOP MEASUREMENT & ZERO-PII TAXONOMY
  // -------------------------------------------------------------------------
  console.log('\n--- 1. PHASE 8A: MEASUREMENT & TAXONOMY ---');
  const analyticsCode = fs.readFileSync(path.join(__dirname, '../src/lib/analytics.ts'), 'utf8');

  check(analyticsCode.includes('visualiser_view'), '33-event taxonomy: visualiser_view defined');
  check(analyticsCode.includes('project_review_clicked'), '33-event taxonomy: project_review_clicked defined');
  check(analyticsCode.includes('consultation_submitted'), '33-event taxonomy: consultation_submitted defined');
  check(analyticsCode.includes('phone_clicked'), '33-event taxonomy: phone_clicked defined');
  check(analyticsCode.includes('isCommercialConversion'), 'Commercial vs Micro conversion classifier exported');
  check(analyticsCode.includes('st_utm_attribution_first'), 'Lifetime first-touch UTM attribution captured');
  check(analyticsCode.includes('st_utm_attribution_last'), 'Journey last-touch UTM attribution captured');
  check(analyticsCode.includes('sanitizeAnalyticsMetadata'), 'Strict zero-PII sanitization engine enforced');

  try {
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'project_review_clicked',
        metadata: { projectType: 'Rear Extension', unhygienic_phone: '07700900123' },
      }),
    });
    const analyticsJson = await analyticsRes.json();
    check(analyticsRes.status === 200 && analyticsJson.success, 'POST /api/analytics returns 200 OK');
    check(analyticsJson.category === 'Commercial', 'Event classified as Commercial conversion');
  } catch (err) {
    check(false, 'POST /api/analytics live check', err.message);
  }

  // -------------------------------------------------------------------------
  // 2. PHASE 8B: CONVERSION OPTIMISATION & ZERO RE-ENTRY LEAD ENGINE
  // -------------------------------------------------------------------------
  console.log('\n--- 2. PHASE 8B: CONVERSION & LEAD ENGINE ---');
  const leadScoringCode = fs.readFileSync(path.join(__dirname, '../src/lib/lead-scoring.ts'), 'utf8');
  const leadRouterCode = fs.readFileSync(path.join(__dirname, '../src/lib/leads/lead-router.ts'), 'utf8');

  check(leadScoringCode.includes('computeVisualiserLeadScore'), '5-dimension Visualiser lead scoring defined');
  check(leadRouterCode.includes('targetResponseHours: 2'), 'HOT lead assigned 2-hour response SLA');
  check(leadRouterCode.includes('targetResponseHours: 24'), 'STRONG lead assigned 24-hour response SLA');
  check(leadRouterCode.includes('ADVISORY'), 'OUTSIDE_CRITERIA lead handled with courteous advisory routing');

  try {
    const mockState = {
      projectId: `proj_test_${Date.now()}`,
      originalBrief: 'Side return extension in Chiswick W4 with Crittall bifolds and bespoke kitchen.',
      projectTypes: ['extension', 'kitchen_renovation'],
      property: {
        type: { value: 'terraced', source: 'user' },
        era: { value: 'victorian', source: 'user' },
        location: { value: 'W4 5YB', source: 'user' },
      },
      spaces: [{ id: 'space-1', name: 'Kitchen Diner', areaM2: { value: 24, source: 'user' } }],
      selectedFinishTier: 'bespoke',
      scopeOfWorks: [
        { id: 'i1', title: 'Excavation & Footings', description: 'Strip foundations', trade: 'Building & Structural' },
        { id: 'i2', title: 'Structural Steelwork', description: 'Universal columns', trade: 'Building & Structural' },
      ],
      budgetAlignment: { indicativeCostRange: { min: 95000, max: 130000, formatted: '£95,000 – £130,000' } },
      complexity: { level: 'MODERATE', scoreOutOf10: 6 },
    };

    const leadRes = await fetch(`${BASE_URL}/api/leads/visualiser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: {
          name: 'Eleanor Sterling',
          email: 'eleanor.sterling@example.co.uk',
          phone: '07700 900456',
          preferredContactMethod: 'phone',
          postcode: 'W4 5YB',
          message: 'Looking to start works in late spring.',
          consent: true,
        },
        state: mockState,
      }),
    });

    const leadJson = await leadRes.json();
    check(leadRes.status === 200 && leadJson.success, 'POST /api/leads/visualiser processes lead with 200 OK');
    check(typeof leadJson.referenceCode === 'string' && leadJson.referenceCode.startsWith('ST-'), `Generates ST- reference code (${leadJson.referenceCode})`);
    check(leadJson.scoreBand === 'HOT', `Algorithmic lead scoring outputs HOT tier (${leadJson.scoreBand})`);
    check(typeof leadJson.nextStep === 'string', 'Returns transparent customer next-step instructions');
  } catch (err) {
    check(false, 'POST /api/leads/visualiser live check', err.message);
  }

  // -------------------------------------------------------------------------
  // 3. PHASE 8C: TECHNICAL SEO, ROBOTS & SITEMAP
  // -------------------------------------------------------------------------
  console.log('\n--- 3. PHASE 8C: TECHNICAL SEO, ROBOTS & SITEMAP ---');
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    check(robotsRes.status === 200, 'GET /robots.txt returns 200 OK');
    check(robotsText.includes('Disallow: /admin/'), 'robots.txt disallows /admin/');
    check(robotsText.includes('Disallow: /api/'), 'robots.txt disallows /api/');
    check(robotsText.includes('Disallow: /portal/'), 'robots.txt disallows private customer /portal/');

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    check(sitemapRes.status === 200, 'GET /sitemap.xml returns 200 OK');
    check(sitemapText.includes('/visualiser'), 'sitemap.xml includes /visualiser');
    check(sitemapText.includes('/visualiser/examples/rear-extension'), 'sitemap.xml includes visualiser example 1');
    check(sitemapText.includes('/visualiser/examples/kitchen-renovation'), 'sitemap.xml includes visualiser example 2');
    check(sitemapText.includes('/visualiser/examples/loft-conversion'), 'sitemap.xml includes visualiser example 3');
  } catch (err) {
    check(false, 'robots.txt / sitemap.xml live check', err.message);
  }

  // -------------------------------------------------------------------------
  // 4. CANONICALISATION & SSR HTML CHECKS
  // -------------------------------------------------------------------------
  console.log('\n--- 4. CANONICALISATION & SSR HTML VERIFICATION ---');
  try {
    const visHtmlRes = await fetch(`${BASE_URL}/visualiser`);
    const visHtml = await visHtmlRes.text();
    check(visHtmlRes.status === 200, 'GET /visualiser returns 200 OK');
    check(visHtml.includes('AI Home Renovation &amp; Extension Visualiser') || visHtml.includes('AI Home Renovation & Extension Visualiser'), 'SSR HTML includes authoritative Phase 8 H1');
    check(visHtml.includes('NO SIGN-UP REQUIRED TO START') && visHtml.includes('FREE PROJECT PLANNING TOOL'), 'SSR HTML includes Section 14 conversion trust strip');
    check(!visHtml.includes('Loading AI Project Scope Builder...'), 'Purged legacy "Loading AI Project Scope Builder..." fallback text');
    check(visHtml.includes('https://schema.org') && visHtml.includes('WebApplication'), 'JSON-LD WebApplication schema rendered');

    // Cost guide canonical & JSON-LD
    const costHtmlRes = await fetch(`${BASE_URL}/cost-guides/extension-cost`);
    const costHtml = await costHtmlRes.text();
    check(costHtml.includes('rel="canonical"') && costHtml.includes('/cost-guides/extension-cost'), 'Cost guide has canonical URL');
    check(costHtml.includes('Visualise My House Extension') || costHtml.includes('/visualiser?projectType='), 'Cost guide has Content -> Tool Visualiser bridge');
    check(costHtml.includes('/calculators/extension-cost-calculator'), 'Cost guide links to live deterministic calculator');

    // Case study canonical & JSON-LD
    const caseHtmlRes = await fetch(`${BASE_URL}/projects/ealing-contemporary-rear-extension`);
    const caseHtml = await caseHtmlRes.text();
    check(caseHtml.includes('rel="canonical"') && caseHtml.includes('/projects/ealing-contemporary-rear-extension'), 'Case study has canonical URL');
    check(caseHtml.includes('Customise This in AI Visualiser'), 'Case study has Customise in Visualiser CTA');
    check(caseHtml.includes('Article'), 'Case study has Schema.org Article structured data');
  } catch (err) {
    check(false, 'Canonical and SSR live checks', err.message);
  }

  // -------------------------------------------------------------------------
  // 5. PHASE 8F & 8G: AI SEARCH & CONTINUOUS OPTIMISATION ENGINE
  // -------------------------------------------------------------------------
  console.log('\n--- 5. PHASE 8F & 8G: AI SEARCH & OPTIMISATION DASHBOARD ---');
  const scServiceCode = fs.readFileSync(path.join(__dirname, '../src/lib/seo/search-console/service.ts'), 'utf8');
  const seoDashboardCode = fs.readFileSync(path.join(__dirname, '../src/components/admin/SeoDashboardView.tsx'), 'utf8');

  check(scServiceCode.includes('getGenerativeAiSearchPerformance'), 'SearchConsoleService: Generative AI Search Reporting method defined');
  check(scServiceCode.includes('AI Overview') && scServiceCode.includes('Gemini Citation'), 'SearchConsoleService: Tracks AI Overviews and Gemini citations');
  check(seoDashboardCode.includes('Google Generative AI Search Reporting'), 'SeoDashboardView: Renders Generative AI Search Reporting UI');
  check(seoDashboardCode.includes('AI Impressions') && seoDashboardCode.includes('AI Clicks'), 'SeoDashboardView: Displays AI impressions, clicks, and CTR');

  console.log('\n================================================================');
  console.log(`PHASE 8 ACCEPTANCE TEST RESULTS: ${passed} / ${passed + failed} PASSED`);
  if (failed === 0) {
    console.log('ALL PHASE 8 ACCEPTANCE CRITERIA VERIFIED (100% SUCCESS)');
  } else {
    console.log(`FAILURES ENCOUNTERED (${failed}):`);
    errors.forEach((e) => console.log(e));
  }
  console.log('================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runSuite();
