# CONSTRUCTION PLATFORM — MASTER PRODUCT SPECIFICATION

## 1. PRODUCT

Build a premium construction company website and web application.

The site should help homeowners:

Plan
↓
Estimate
↓
Visualise
↓
Understand
↓
Contact Us
↓
Let Us Build It

Primary proposition:

> Plan it.  
> Price it.  
> Visualise it.  
> Let us build it.

## 2. TARGET CUSTOMER

Prioritise homeowners planning substantial projects such as:

- extensions
- full renovations
- loft conversions
- kitchen renovations
- bathrooms
- garage conversions
- garden rooms
- driveways
- landscaping
- new builds

The best lead is someone with:

- a genuine property
- realistic project
- sufficient budget
- location inside service area
- intention to build
- expected start within approximately 12 months

## 3. PRIMARY SITE NAVIGATION

Create:

- Home
- Plan Your Project
- Calculators
- Services
- Projects
- Cost Guides
- Advice
- About
- Contact

**Primary CTA**:
Start Your Project

**Secondary CTA**:
Book Consultation

## 4. HOMEPAGE

**Hero**:
> Plan Your Project.  
> Know Your Budget.  
> Let Us Build It.

**Supporting copy**:
> Use our free construction tools to explore your project, estimate costs and understand what may be involved. When you're ready, our team can manage the entire project from planning to completion.

**Buttons**:
- Start My Project
- Explore Free Tools

## 5. HOMEPAGE PROJECT SELECTOR

Display:

- Extension
- Full Renovation
- Kitchen
- Bathroom
- Loft Conversion
- Garage Conversion
- Garden Room
- Driveway
- Landscaping
- New Build

Each should launch the relevant project planning flow.

## 6. PLAN MY PROJECT

Create:

`/plan-my-project`

This is the most commercially important tool.

- Use a multi-step wizard.
- Show approximately one key question at a time.
- Display progress.
- Support conditional questions.

## 7. PROJECT TYPE

Ask:

> What are you planning?

Options:
- Extension
- Full Renovation
- Kitchen Renovation
- Bathroom Renovation
- Loft Conversion
- Garage Conversion
- Garden Room
- Driveway
- Landscaping
- New Build
- Other

## 8. PROPERTY

Ask:

- property type
- number of bedrooms
- approximate property size
- project postcode

Property types:
- detached
- semi-detached
- terraced
- bungalow
- flat
- other

Postcode should help determine:
- service area
- regional cost assumptions
- lead quality

Do not require full address initially.

## 9. SIZE

Ask project-specific measurements.

Examples:

- **Extension**: length, width, storeys
- **Driveway**: length, width
- **Renovation**: floor area, number of rooms

Always allow:
> I don't know

## 10. REQUIREMENTS

Ask dynamic project-specific options.

Extension example:
- new kitchen
- utility
- bathroom
- structural opening
- rooflights
- bifold doors
- sliding doors
- underfloor heating
- new flooring
- decorating
- landscaping

## 11. FINISH LEVEL

Options:

- **Essential**: Functional and cost-focused.
- **Standard**: Good quality finish.
- **Premium**: Higher specification.
- **Luxury**: Bespoke / premium materials.

Finish level should influence pricing.

## 12. PROJECT STATUS

Ask:

> What stage are you at?

Options:
- exploring ideas
- researching costs
- ready to plan
- architectural drawings completed
- planning submitted
- planning approved
- Building Regulations underway
- ready to appoint contractor
- construction already started

## 13. TIMELINE

Ask:

> When would you ideally like construction to begin?

Options:
- ASAP
- 1–3 months
- 3–6 months
- 6–12 months
- 12+ months
- researching only

## 14. BUDGET

Ask appropriate budget ranges.

General example:
- Under £10k
- £10k–£25k
- £25k–£50k
- £50k–£100k
- £100k–£200k
- £200k+
- Not sure

Use project-specific ranges where appropriate.

## 15. PROJECT RESULT

After completion show a detailed useful result immediately.

Example:
> Your Rear Extension  
> Estimated Project Range  
> £70,000–£90,000

Clearly state:
> Indicative planning estimate.

Then show:
- estimated duration
- project complexity
- likely stages
- likely work categories
- likely trades
- cost drivers
- possible considerations

## 16. PROJECT COST BREAKDOWN

Where possible show categories such as:

- design/pre-construction
- site preparation
- groundworks
- structure
- roof
- windows/doors
- electrical
- plumbing
- heating
- plastering
- flooring
- kitchen
- bathroom
- decoration
- external works
- contingency

Do not imply this is a formal quotation.

## 17. PROJECT TIMELINE

Display a visual process.

Example:

Planning
↓
Design
↓
Permissions
↓
Site Preparation
↓
Groundworks
↓
Structure
↓
Weatherproofing
↓
First Fix
↓
Plastering
↓
Second Fix
↓
Finishes
↓
Snagging
↓
Completion

## 18. MAIN CONVERSION

After results:

> Want us to take care of the entire project?

Supporting copy:

> Our construction team can review your project, discuss your requirements and help you understand the next steps.

- **Primary**: Book Free Project Consultation
- **Secondary**: Request a Callback
- **Third**: Save My Project

## 19. CALCULATOR HUB

Create:

`/calculators`

## 20. FIRST CALCULATORS

Build these first:

- Extension Cost Calculator
- House Renovation Cost Calculator
- Kitchen Renovation Cost Calculator
- Bathroom Renovation Cost Calculator
- Loft Conversion Cost Calculator
- Garage Conversion Cost Calculator
- Driveway Cost Calculator
- Garden Room Cost Calculator
- Concrete Calculator
- Brick Calculator
- Block Calculator
- Tile Calculator
- Flooring Calculator
- Paint Calculator
- Plaster Calculator
- Patio Calculator
- Decking Calculator
- Fence Calculator
- Gravel Calculator
- Turf Calculator

## 21. CALCULATOR ENGINE

Create reusable calculator definitions.

Each calculator should support fields such as:

- id
- name
- slug
- description
- category
- inputs
- units
- formula
- wasteAllowance
- pricingRules
- results
- relatedCalculators
- relatedProject
- seo
- cta

## 22. CALCULATOR PAGE

Each calculator should contain:

- H1
- brief explanation
- inputs
- result
- waste allowance
- optional price estimate
- assumptions
- FAQs
- related calculator
- related project guide
- project CTA

Example:

> Planning an extension?
> 
> You've calculated your bricks.  
> Now estimate your complete extension.
> 
> Plan My Extension →

## 23. PRICING SYSTEM

Create central pricing data.

Pricing should support:

- material
- labour
- unit
- region
- project type
- finish level
- complexity
- date updated

Admin should eventually be able to update this without changing code.

## 24. LEAD CAPTURE

When a customer requests contact collect only missing information.

Potential fields:

- first name
- last name
- email
- phone
- preferred contact method
- best time
- notes

Automatically attach:

- project type
- postcode
- dimensions
- budget
- timeline
- estimate
- project status
- selected features
- calculator results
- acquisition source

## 25. LEAD SCORING

Create internal score from 0–100.

Consider:

- project value
- project type
- budget
- timeline
- planning status
- readiness
- location
- planner completion
- consultation request

Suggested bands:

- 80–100 HOT
- 60–79 HIGH
- 40–59 MEDIUM
- 0–39 EARLY

Do not show this score publicly.

## 26. CRM

Create secure admin area.

Pipeline:

1. New
2. Attempting Contact
3. Contacted
4. Consultation Booked
5. Consultation Completed
6. Site Visit Booked
7. Site Visit Completed
8. Preparing Quote
9. Quote Sent
10. Follow Up
11. Negotiating
12. Won
13. Lost
14. Future Opportunity

## 27. CRM DASHBOARD

Show:

- new leads
- hot leads
- consultations
- site visits
- quotes
- won projects
- estimated pipeline value
- lead sources
- popular calculators
- conversion rates

## 28. LEAD DETAIL

Show:

- customer details
- project
- postcode
- budget
- estimate
- timeline
- project status
- planner answers
- calculations
- uploaded files
- AI conversations
- consultation details
- internal notes
- score
- source
- CRM stage

## 29. CONSULTATION SYSTEM

Support:

- Book Consultation
- Request Callback
- Request Site Visit

If calendar integration exists, allow available appointment slots.

Otherwise allow consultation requests.

## 30. SERVICES

Create pages for relevant actual services:

- Extensions
- Renovations
- Kitchen Renovations
- Bathroom Renovations
- Loft Conversions
- Garage Conversions
- Garden Rooms
- Driveways
- Landscaping
- New Builds

Each service page should contain:

- hero
- overview
- process
- relevant calculator
- cost guidance
- case studies
- FAQs
- testimonials
- CTA

## 31. COMPANY POSITIONING

Communicate:

> One team.  
> One project.  
> From idea to completion.

Only mention services genuinely offered.

Possible areas:

- planning support
- design coordination
- project management
- construction
- trades coordination
- finishing
- landscaping
- handover

## 32. PROJECT PORTFOLIO

Create CMS-backed case studies.

Support:

- title
- project type
- location
- customer objective
- before images
- progress images
- after images
- challenge
- solution
- services
- duration
- testimonial
- gallery

CTA:

> Planning Something Similar?  
> Start Your Project

## 33. COST GUIDES

Create:

`/cost-guides`

Examples:

- Extension Costs
- Renovation Costs
- Loft Conversion Costs
- Kitchen Costs
- Bathroom Costs
- Driveway Costs
- Garden Room Costs

Include:

- indicative prices
- cost factors
- timeline
- common additional costs
- FAQs
- calculator
- case study
- CTA

## 34. ADVICE HUB

Create:

`/advice`

Categories:

- Extensions
- Renovation
- Planning
- Building Regulations
- Kitchens
- Bathrooms
- Lofts
- Driveways
- Landscaping
- Costs
- Materials
- Project Management

## 35. LOCAL SEO

Create location functionality only for real service areas.

Example:

- `/areas/ealing`
- `/areas/richmond`
- `/areas/harrow`

Each page must provide real useful local content.

Do not just change the place name.

## 36. CUSTOMER ACCOUNTS

Do NOT require an account to use basic tools.

Accounts should unlock:

- save project
- save calculations
- save visualisations
- upload files
- return later
- manage consultation

## 37. CUSTOMER DASHBOARD

Create:

`My Projects`

Project sections:

- Overview
- Estimate
- Timeline
- Calculations
- Images
- Documents
- Consultation
- Notes

## 38. AI CONSTRUCTION ASSISTANT

Build after the core commercial funnel works.

Example user input:

> I want to knock through my kitchen and dining room and build a rear extension.

AI should identify:

- likely project type
- likely works
- potential structural considerations
- likely stages
- potential trades
- questions to consider

Then:

> Create Project From This

Transfer extracted information into Plan My Project.

## 39. AI VISUALISER

Build later.

Allow user to upload property photo and choose:

- extension concept
- driveway
- landscaping
- cladding
- windows
- doors
- kitchen
- bathroom
- exterior renovation

Clearly state:

> Concept visualisation only.

CTA:

> Like This Idea?  
> Discuss This Project With Us

## 40. ANALYTICS

Track events such as:

- calculator viewed
- calculator started
- calculator completed
- planner started
- planner step completed
- planner abandoned
- project estimate generated
- project saved
- account created
- consultation clicked
- consultation booked
- callback requested
- phone clicked
- AI used
- visualiser used
- service viewed
- case study viewed

## 41. BUSINESS FUNNEL DASHBOARD

Measure:

Visitors
↓
Calculator Users
↓
Planner Starts
↓
Planner Completions
↓
Estimates
↓
Leads
↓
Consultations
↓
Site Visits
↓
Quotes
↓
Won Projects

**Primary KPI**:
Qualified construction projects generated (not simply website traffic).

## 42. DATABASE

Create appropriately structured entities for:

- Users
- Projects
- ProjectAnswers
- ProjectTypes
- Calculations
- CalculatorDefinitions
- PricingRules
- PricingRegions
- Leads
- LeadActivities
- Consultations
- CRMStages
- Services
- CaseStudies
- Articles
- CostGuides
- Locations
- Testimonials
- Uploads
- AISessions
- AIUsage
- AdminUsers
- ConsentRecords
- AnalyticsEvents

Adapt exact tables to the existing stack.

## 43. CMS / ADMIN CONTENT

Allow admin management of:

- services
- projects
- case studies
- testimonials
- articles
- cost guides
- FAQs
- locations
- calculator content
- calculator SEO
- pricing assumptions
- homepage
- metadata

## 44. EMAIL

Transactional emails should eventually support:

- enquiry confirmation
- consultation confirmation
- consultation reminder
- saved project
- estimate saved
- callback request
- admin new lead
- admin hot lead

Do not send marketing communications without appropriate consent.

## 45. SEO INFRASTRUCTURE

Implement:

- metadata
- canonical URLs
- XML sitemap
- robots.txt
- breadcrumbs
- semantic HTML
- structured data
- clean URLs
- Open Graph
- heading hierarchy
- 404 handling
- redirect capability
- noindex controls

Do not index:
- admin
- private accounts
- private projects
- internal search pages where inappropriate

## 46. TRUST

Include genuine:

- completed projects
- testimonials
- team
- company information
- experience
- insurance
- qualifications
- accreditations
- guarantees

Only where actually true.

Never fabricate trust signals.

## 47. LEGAL / PRIVACY

Prepare:

- Privacy Policy
- Cookie Policy
- Terms
- Website Terms
- Calculator Disclaimer
- AI Disclaimer
- Accessibility Statement
- Marketing Consent
- Data deletion process

Legal content should be reviewed professionally before final use.

## 48. COOKIE CONSENT

Allow proper consent for non-essential tracking.

Do not unnecessarily load non-essential tracking before consent where applicable.

## 49. RECOMMENDED TECHNICAL PRINCIPLES

If the existing stack works, preserve it.

If starting from scratch, suitable technology may include:

- Next.js
- React
- TypeScript
- PostgreSQL
- managed authentication
- object storage
- transactional email
- AI provider abstraction

Do not rewrite a functioning project simply to match this suggestion.
