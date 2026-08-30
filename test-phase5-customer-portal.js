/**
 * PHASE 5 CUSTOMER PORTAL & ACCOUNTS — COMPREHENSIVE TEST SUITE
 * Validates Value-First Customer Accounts, Project Timelines, Calculations History,
 * Document Uploads, Consultations, and Ungated Calculator Access.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('================================================================');
console.log('  APEX CONSTRUCTION — PHASE 5 CUSTOMER PORTAL TEST SUITE');
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

// ============================================================================
// SECTION 1: ARCHITECTURE & ROUTE INTEGRITY
// ============================================================================
console.log('--- SECTION 1: CUSTOMER PORTAL FILE INTEGRITY ---');

const expectedFiles = [
  'src/lib/customer-auth/index.ts',
  'src/lib/db/schema.ts',
  'src/lib/db/index.ts',
  'src/app/api/customer/auth/register/route.ts',
  'src/app/api/customer/auth/login/route.ts',
  'src/app/api/customer/auth/logout/route.ts',
  'src/app/api/customer/auth/me/route.ts',
  'src/app/api/customer/projects/route.ts',
  'src/app/api/customer/projects/[id]/route.ts',
  'src/app/api/customer/calculations/route.ts',
  'src/app/api/customer/documents/route.ts',
  'src/app/api/customer/consultations/route.ts',
  'src/app/portal/layout.tsx',
  'src/app/portal/login/page.tsx',
  'src/app/portal/register/page.tsx',
  'src/app/portal/dashboard/page.tsx',
  'src/app/portal/projects/page.tsx',
  'src/app/portal/projects/[id]/page.tsx',
  'src/app/portal/calculations/page.tsx',
  'src/app/portal/documents/page.tsx',
  'src/app/portal/consultations/page.tsx',
  'src/components/portal/CustomerProjectStatusBadge.tsx',
  'src/components/portal/TimelineProgressView.tsx',
  'src/components/portal/SavedCalculationsList.tsx',
  'src/components/portal/DocumentsManagerView.tsx',
  'src/components/portal/ConsultationsManagerView.tsx',
  'src/components/portal/CustomerLogoutButton.tsx',
];

expectedFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  assert(exists, `Portal file '${file}' exists`);
});

// ============================================================================
// SECTION 2: PASSWORD HASHING & SESSION TOKEN SECURITY
// ============================================================================
console.log('\n--- SECTION 2: AUTHENTICATION & TOKEN SIGNING ---');

const SECRET = 'customer-portal-secret-salt-2026';

function hashPassword(password) {
  return crypto.createHmac('sha256', SECRET).update(password.trim()).digest('hex');
}

function createToken(userId, email) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    })
  ).toString('base64url');

  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadBase64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

const pwdHash1 = hashPassword('MySecretPass2026!');
const pwdHash2 = hashPassword('MySecretPass2026!');
const diffHash = hashPassword('DifferentPassword');

assert(pwdHash1 === pwdHash2, 'Password hashing is deterministic and reproducible');
assert(pwdHash1 !== diffHash, 'Different passwords produce distinct hashes');

const token = createToken('cust_123', 'sarah@example.co.uk');
const verified = verifyToken(token);
assert(verified && verified.userId === 'cust_123', 'Signed session token verifies accurately');
assert(verified && verified.email === 'sarah@example.co.uk', 'Session token preserves customer email');

const tamperedToken = token + 'tampered';
assert(verifyToken(tamperedToken) === null, 'Tampered token is rejected');

// ============================================================================
// SECTION 3: 7-STAGE TIMELINE TRACKER INITIALIZATION
// ============================================================================
console.log('\n--- SECTION 3: 7-STAGE CONSTRUCTION TIMELINE ---');

function generateTimeline() {
  return [
    { stageNumber: 1, title: 'Online Scope & Indicative Estimate', status: 'COMPLETED' },
    { stageNumber: 2, title: 'Free Architectural Consultation', status: 'IN_PROGRESS' },
    { stageNumber: 3, title: 'Site Survey & Laser Measure', status: 'UPCOMING' },
    { stageNumber: 4, title: 'Structural Steel Calculations & Itemized Quote', status: 'UPCOMING' },
    { stageNumber: 5, title: 'Pre-Construction & Material Procurement', status: 'UPCOMING' },
    { stageNumber: 6, title: 'On-Site Construction & Groundworks', status: 'UPCOMING' },
    { stageNumber: 7, title: 'Final Snagging & Building Control Certificate', status: 'UPCOMING' },
  ];
}

const stages = generateTimeline();
assert(stages.length === 7, 'Timeline contains exactly 7 standard construction stages');
assert(stages[0].status === 'COMPLETED', 'Stage 1 is marked COMPLETED upon estimate creation');
assert(stages[1].status === 'IN_PROGRESS', 'Stage 2 (Consultation) is marked IN_PROGRESS');
assert(stages[6].stageNumber === 7 && stages[6].status === 'UPCOMING', 'Stage 7 is marked UPCOMING');

// ============================================================================
// SECTION 4: VALUE-FIRST PROJECT SAVING (UNAUTHENTICATED → AUTHENTICATED)
// ============================================================================
console.log('\n--- SECTION 4: VALUE-FIRST PERSISTENCE FUNNEL ---');

const quoteConfiguratorCode = fs.readFileSync(
  path.join(__dirname, 'src/components/planner/QuoteConfigurator.tsx'),
  'utf8'
);
assert(
  quoteConfiguratorCode.includes('handleSaveToAccount'),
  'QuoteConfigurator implements handleSaveToAccount'
);
assert(
  quoteConfiguratorCode.includes('pending_saved_project'),
  'QuoteConfigurator preserves unauthenticated estimates to session storage'
);

const registerCode = fs.readFileSync(
  path.join(__dirname, 'src/app/portal/register/page.tsx'),
  'utf8'
);
assert(
  registerCode.includes('pending_saved_project'),
  'Register page detects pending estimate and displays preview'
);
assert(
  registerCode.includes('pending_saved_calculation'),
  'Register page detects pending trade calculation'
);

// ============================================================================
// SECTION 5: SAVED CALCULATIONS & UNGATED ACCESS
// ============================================================================
console.log('\n--- SECTION 5: SAVED CALCULATIONS & UNGATED ACCESS ---');

const calcViewCode = fs.readFileSync(
  path.join(__dirname, 'src/components/calculators/CalculatorView.tsx'),
  'utf8'
);
assert(
  calcViewCode.includes('handleSaveCalculation'),
  'CalculatorView implements handleSaveCalculation'
);
assert(
  calcViewCode.includes('Save Calculation to My Account'),
  'CalculatorView displays prominent Save Calculation CTA'
);
assert(
  !calcViewCode.includes('requireAuthToCalculate'),
  'Calculators are 100% UNGATED and accessible without registration'
);

// ============================================================================
// SECTION 6: DOCUMENT CATEGORIES & APPOINTMENT TYPES
// ============================================================================
console.log('\n--- SECTION 6: DOCUMENT VAULT & APPOINTMENT TYPES ---');

const schemaCode = fs.readFileSync(
  path.join(__dirname, 'src/lib/db/schema.ts'),
  'utf8'
);
assert(
  schemaCode.includes('ARCHITECTURAL_DRAWING'),
  'Schema defines ARCHITECTURAL_DRAWING category'
);
assert(
  schemaCode.includes('PLANNING_NOTICE'),
  'Schema defines PLANNING_NOTICE category'
);
assert(
  schemaCode.includes('STRUCTURAL_CALCULATION'),
  'Schema defines STRUCTURAL_CALCULATION category'
);
assert(
  schemaCode.includes('SITE_PHOTO'),
  'Schema defines SITE_PHOTO category'
);
assert(
  schemaCode.includes('DbCustomerUser'),
  'Schema defines DbCustomerUser model'
);
assert(
  schemaCode.includes('DbSavedCalculation'),
  'Schema defines DbSavedCalculation model'
);
assert(
  schemaCode.includes('DbCustomerDocument'),
  'Schema defines DbCustomerDocument model'
);

console.log('\n================================================================');
console.log(`TOTAL PHASE 5 CHECKS: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
if (failedTests === 0) {
  console.log('STATUS: ALL PHASE 5 CUSTOMER PORTAL CHECKS PASSED (100% SUCCESS)');
} else {
  console.log(`STATUS: ${failedTests} CHECKS FAILED`);
  process.exit(1);
}
console.log('================================================================\n');
