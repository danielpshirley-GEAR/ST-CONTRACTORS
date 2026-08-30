# CONSTRUCTION PLATFORM — PERMANENT ANTIGRAVITY INSTRUCTIONS

## 1. SOURCE OF TRUTH

BUILD_SPEC.md contains the complete product specification.

Before making significant changes:

- Read GEMINI.md.
- Read the relevant sections of BUILD_SPEC.md.
- Inspect the existing application.
- Preserve useful working functionality.
- Implement the requested phase only.
- Test the implementation.
- Fix errors before declaring completion.

Do not attempt to build the entire specification at once.

## 2. BUSINESS PURPOSE

This platform exists to generate qualified construction projects for OUR construction company.

It is NOT:

- a builder marketplace
- a contractor directory
- a lead selling platform
- a comparison marketplace
- a system for sending projects to other builders

The commercial journey is:

Google Search
↓
Useful Free Tool
↓
Project Planning
↓
Project Estimate
↓
Trust
↓
Consultation
↓
Site Visit
↓
Quote
↓
Our Construction Company Wins the Job

Every important feature should contribute to:

- Attracting potential customers
- Educating customers
- Helping customers plan
- Demonstrating expertise
- Gathering project information
- Qualifying the lead
- Generating consultations
- Generating construction projects

## 3. CUSTOMER-FIRST RULE

Give useful information before aggressively requesting customer details.

Bad:

> Enter your email to see your estimate.

Preferred:

> Your estimated project range is £65,000–£80,000.
> 
> Would you like our construction team to review your project?

Then:

> Book Free Project Consultation

## 4. DEVELOPMENT APPROACH

Before editing code:

- Inspect existing files.
- Understand current architecture.
- Identify reusable components.
- Check the specification.
- Make the smallest robust change.
- Test it.
- Fix errors.
- Document the work.

Do not unnecessarily replace functioning systems.

## 5. BUILD ORDER

Follow this order:

- **Phase 0**: Audit
- **Phase 1**: Foundation
- **Phase 2**: Project Planner + Lead Generation Engine
- **Phase 3**: Calculator Engine
- **Phase 4**: SEO + Content Engine
- **Phase 5**: Customer Accounts
- **Phase 6**: AI Construction Assistant
- **Phase 7**: AI Visualisation
- **Phase 8**: Conversion + SEO Optimisation

Do not prioritise flashy AI features before the lead generation system works.

## 6. REUSABLE ARCHITECTURE

Prefer:

- reusable components
- modular architecture
- central configuration
- typed data
- shared calculator systems
- shared pricing systems
- shared form components
- shared SEO components
- testable functions
- maintainable database models

Avoid:

- duplicated components
- duplicated formulas
- hardcoded prices
- hardcoded location pages
- giant monolithic components
- unnecessary dependencies
- fake functionality

## 7. CALCULATOR RULES

Do NOT build every calculator independently.

Use a reusable calculator engine.

Separate:

### Quantity Engine
Handles:
- length
- width
- height
- area
- volume
- quantities
- waste allowance
- unit conversions

### Pricing Engine
Handles:
- material price
- labour assumptions
- location
- project type
- specification
- finish level
- complexity
- contingency

### Presentation Engine
Handles:
- customer-facing estimate
- explanation
- related tools
- related project planner
- CTA

AI must NOT be used for simple calculations.

## 8. PRICING

Pricing must be centrally managed.

Do not scatter prices throughout frontend code.

Store:
- price
- unit
- category
- project type
- region
- finish level
- source/notes where appropriate
- last updated date

Customer-facing prices should normally use language such as:
- estimated
- indicative
- approximate
- guide price

Never present calculator output as a formal quotation.

## 9. LEAD GENERATION

Every useful tool should eventually move the customer toward:

- **Plan My Project**
or:
- **Book Free Project Consultation**

Do not create dead-end calculators.

## 10. DATA REUSE

If a customer already supplied information, reuse it.

Do not repeatedly ask for:
- postcode
- project type
- dimensions
- budget
- timeline
- property type
- contact details

Carry project context between relevant tools.

## 11. SEO

SEO pages must provide genuine value.

Do not generate thousands of near-identical pages.

Avoid:
- keyword stuffing
- thin AI content
- duplicate city pages
- fake FAQs
- meaningless programmatic SEO

Important public pages should support:
- SEO title
- meta description
- canonical URL
- H1
- structured headings
- breadcrumbs
- internal links
- image alt text
- structured data where appropriate
- index/noindex control

## 12. INTERNAL LINKING

Use intentional commercial journeys.

Example:

Brick Calculator
↓
Extension Calculator
↓
Extension Cost Guide
↓
Extension Case Study
↓
Extension Service
↓
Plan My Extension
↓
Book Consultation

## 13. AI RULES

AI can help with:
- understanding customer descriptions
- explaining construction terminology
- creating project checklists
- generating scope drafts
- identifying likely project stages
- suggesting questions to consider
- converting conversation into structured project data

AI must NOT claim authority over:
- structural engineering
- structural safety
- planning approval
- Building Regulations approval
- gas safety
- electrical certification
- legal decisions
- exact construction costs

## 14. AI COST CONTROL

AI calls must be server-side.

Implement:
- rate limiting
- usage tracking
- request limits
- image limits
- error handling
- fallback behaviour
- model abstraction
- optional caching

Never expose API keys in frontend code.

## 15. SECURITY

Protect:
- database credentials
- authentication secrets
- admin accounts
- email API keys
- AI API keys
- uploaded customer information

Implement where appropriate:
- authentication
- authorisation
- input validation
- sanitisation
- rate limiting
- protected admin routes
- upload validation
- server-side secrets
- error logging
- database permissions

## 16. MOBILE FIRST

Assume many customers arrive from Google on mobile.

All major experiences must work exceptionally well on mobile:
- calculators
- project planner
- estimate results
- consultation forms
- account dashboard
- navigation
- AI assistant

Use appropriate numeric input types for measurements.

## 17. PERFORMANCE

Prioritise:
- Core Web Vitals
- fast loading
- responsive images
- image compression
- lazy loading
- small frontend bundles
- caching
- server rendering for SEO pages
- efficient API calls

Do not load AI functionality unless needed.

## 18. ACCESSIBILITY

Target WCAG 2.2 AA principles.

Support:
- keyboard navigation
- visible focus
- semantic HTML
- proper labels
- readable errors
- sufficient contrast
- accessible forms
- alt text
- large interaction targets

## 19. CONTENT INTEGRITY

Never invent:
- testimonials
- reviews
- accreditations
- awards
- qualifications
- insurance
- guarantees
- completed projects
- company statistics

Use editable placeholders if real information has not been provided.

## 20. FUNCTIONAL INTEGRITY

Do not create buttons that pretend to work.

Features must either:
- work
- be visibly marked as unavailable
- not be displayed yet

Do not create fake:
- booking systems
- CRM actions
- AI integrations
- payment systems
- authentication
- email integrations

## 21. TESTING

After meaningful development work:
- Run application.
- Run production build.
- Fix compilation errors.
- Fix console errors.
- Test mobile.
- Test desktop.
- Test forms.
- Test validation.
- Test database writes.
- Test permissions.
- Test error states.
- Test major customer journeys.

Calculator testing should include:
- blank values
- zero
- decimals
- large numbers
- invalid values
- unit conversions
- formula accuracy

Critical calculation functions require automated tests.

## 22. COMPLETION REPORT

At the end of each development phase report:
- COMPLETED
- ROUTES CREATED
- FILES CHANGED
- DATABASE CHANGES
- APIs / BACKEND
- ENVIRONMENT VARIABLES
- TESTING COMPLETED
- KNOWN ISSUES
- NEXT PHASE
- STATUS

Do not declare a phase complete while known critical errors remain.

## 23. CORE CONTENT QUALITY RULE — NON-NEGOTIABLE

Every page created for this website must have a clear, distinct and genuinely useful purpose.

Do not create pages simply to target another:
- keyword
- service variation
- town
- postcode
- borough
- property type
- search phrase

The objective is not to create the largest possible number of pages.
The objective is to create the most useful construction and renovation resource possible for homeowners in London and South East England — while demonstrating genuine expertise and naturally converting the right visitors into paying customers.

### WHY DOES THIS PAGE DESERVE TO EXIST?
Before creating a page, determine:
1. Who is searching for this?
2. What problem are they trying to solve?
3. What decision are they trying to make?
4. What information do they genuinely need?
5. What information is currently missing from competing pages?
6. What unique construction expertise can we contribute?
7. What first-hand experience can our team contribute?
8. What real projects can support the advice?
9. What practical examples can we provide?
10. What should the homeowner understand after reading?
11. What should their logical next step be?
12. Could this search realistically lead to a profitable construction project?

If an existing page already satisfies substantially the same intent:
**DO NOT CREATE ANOTHER PAGE.**
Instead recommend:
- EXPAND EXISTING PAGE
- IMPROVE EXISTING PAGE
- MERGE
- REPOSITION
- CHANGE SEARCH INTENT
- DO NOT CREATE

### EVERY PAGE MUST ADD UNIQUE VALUE
A page should ideally add several of the following:
- FIRST-HAND BUILDER EXPERIENCE
- REAL PROJECT EXPERIENCE
- REAL PHOTOGRAPHY
- CONSTRUCTION PROCESS KNOWLEDGE
- COST BREAKDOWNS
- HIDDEN COSTS
- TIMELINES
- COMMON PROBLEMS
- WARNING SIGNS
- COMMON HOMEOWNER MISTAKES
- MATERIAL COMPARISONS
- TRADE-OFFS
- PROPERTY-SPECIFIC ADVICE
- LONDON-SPECIFIC CONSIDERATIONS
- LOCAL KNOWLEDGE
- PROJECT EXAMPLES
- CHECKLISTS
- DECISION GUIDES
- DIAGRAMS
- CALCULATORS
- CASE STUDIES
- PRACTICAL NEXT STEPS

If the only justification for a page is: "It gives us another keyword to rank for." -> **Do not create it.**

### FIRST-HAND CONSTRUCTION EXPERIENCE
Content should read as though it has been created with meaningful input from experienced construction professionals.
Where genuine information exists, incorporate observations such as:
- Problems our builders regularly encounter
- Things we inspect before quoting
- Unexpected problems found during strip-out
- Mistakes homeowners commonly make
- Materials we prefer and why
- Materials or methods we avoid
- Where spending more is worthwhile
- Where customers may be able to save
- What causes delays
- What causes costs to increase
- How we sequence trades
- What frequently goes wrong
- How previous projects were solved
- Questions customers repeatedly ask

Examples of appropriate wording:
- "From our experience renovating older London properties..."
- "One issue our team regularly encounters..."
- "Before pricing this type of project, we normally check..."
- "A common mistake we see homeowners make is..."
- "On a previous project, we solved this by..."

Only use such language when genuine internal evidence exists. Never fabricate first-hand experience. If genuine information is unavailable, flag: `[FIRST-HAND EXPERIENCE OPPORTUNITY]`

### EXPLAIN HOW CONSTRUCTION ACTUALLY WORKS
Do not create vague statements such as: "We provide high-quality bathroom renovations."
Explain useful details such as:
- What happens first
- What happens next
- Which trades are involved
- Why the sequence matters
- What can go wrong
- What preparation is required
- What customers should expect
- What affects cost
- What affects duration
- What decisions need to be made

An experienced builder should be comfortable putting their name behind the advice.

### ANSWER THE NEXT QUESTION
Content should anticipate what the homeowner is likely to ask next (costs, timelines, what affects price, what might be discovered, staying in the property, approvals, trade sequence, comparing builders, where to spend vs save, what happens if something unexpected is found).
Only include questions relevant to the specific page. Do not add generic FAQs merely for SEO.

### EXPLAIN TRADE-OFFS
Do not pretend there is always one "best" construction solution.
Where relevant compare OPTION A vs OPTION B (Cost, Benefits, Disadvantages, Durability, Maintenance, Installation Complexity, Timeline Impact, Who Each Option Suits).

### LONDON AND SOUTH EAST RELEVANCE
Where appropriate demonstrate genuine understanding of: Victorian terraces, Edwardian houses, Georgian properties, 1930s houses, Post-war homes, Flats, Maisonettes, Conversions, Listed buildings, Conservation areas.
And specific London realities: No side access, Shared walls, Parking restrictions, Material deliveries, Skip permits, Scaffolding, Party Wall matters, Old plumbing, Old electrical systems, Suspended timber floors, Uneven floors, Damp, Chimney breasts, Historic alterations, Poor previous renovations.
Only include local information when genuinely relevant. Do not replace "Ealing" with "Chiswick" and call it a new page.

### AI CONTENT RULE
AI may assist with: Research, Structure, Drafting, Editing, SERP analysis, SEO, Metadata, FAQs, Internal links, Content auditing.
AI must NEVER invent: Projects, Builder experience, Customer stories, Testimonials, Reviews, Prices presented as fact, Statistics, Locations worked, Qualifications, Accreditations, Construction regulations, Photographs, Case studies.
Unknown information should remain unknown or be flagged for human input.

### QUALITY OVER QUANTITY
100 excellent pages are more valuable than 1,000 thin pages.
Never optimise content production around word count or page count. Optimise around:
- SEARCH INTENT SATISFACTION
- ORIGINALITY
- FIRST-HAND EXPERIENCE
- USEFULNESS
- CONSTRUCTION EXPERTISE
- TRUST
- COMMERCIAL RELEVANCE
- CUSTOMER CONVERSION

### PAGE QUALITY GATE
Before publication, every page must pass the 20-point quality check. If several answers are NO: **DO NOT PUBLISH.** Improve the page first.

### FINAL CONTENT PRINCIPLE
Do not build pages for search engines. Build genuinely useful construction resources for homeowners that search engines have a reason to rank and customers have a reason to trust.
Every page must earn its place on the website.

