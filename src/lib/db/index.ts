import {
  DbContactSubmission,
  DbLead,
  DbAnalyticsEvent,
  DbProject,
  DbConsultation,
  CrmStage,
  DbLeadNote,
  DbCustomerUser,
  DbSavedCalculation,
  DbCustomerDocument,
  ProjectTimelineStage,
  CustomerProjectStatus,
} from './schema';
import {
  ComprehensivePlannerInput,
  ProjectScopeItem,
  RecommendedWorkItem,
  FullProjectQuoteEstimate,
} from '../ai/types';
import { generateRoomByRoomScope, generateContextualRecommendations } from '../ai/planner';
import { calculateFullRoomQuote } from '../pricing/room-estimator';
import { computeLeadScore } from '../lead-scoring';

function generateRefCode(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ST-${year}-${num}`;
}

export function generateDefaultTimelineStages(projectType: string = 'extension'): ProjectTimelineStage[] {
  return [
    {
      id: 'stage-1',
      stageNumber: 1,
      title: 'Online Scope & Indicative Estimate',
      description: 'Your project specification and room dimensions configured online.',
      status: 'COMPLETED',
      completedDate: new Date().toISOString().split('T')[0],
      notes: 'Initial room-by-room scope calculated.',
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      title: 'Free Architectural Consultation',
      description: 'Review project feasibility, layout options, and planning guidance with our lead surveyor.',
      status: 'IN_PROGRESS',
      estimatedWeeks: 'Week 1',
      notes: 'Consultation scheduling available via portal.',
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      title: 'Site Survey & Laser Measure',
      description: 'On-site technical survey, drain inspection, and boundary check.',
      status: 'UPCOMING',
      estimatedWeeks: 'Week 2',
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      title: 'Structural Steel Calculations & Itemized Quote',
      description: 'Building control compliant calculations and formal fixed-price quotation.',
      status: 'UPCOMING',
      estimatedWeeks: 'Week 3–4',
    },
    {
      id: 'stage-5',
      stageNumber: 5,
      title: 'Pre-Construction & Material Procurement',
      description: 'Party wall notices, council permits, and scheduling dedicated trade teams.',
      status: 'UPCOMING',
      estimatedWeeks: 'Week 5–6',
    },
    {
      id: 'stage-6',
      stageNumber: 6,
      title: 'On-Site Construction & Groundworks',
      description: 'Excavation, brickwork shell, structural steels, first/second fix, and plastering.',
      status: 'UPCOMING',
      estimatedWeeks: 'Weeks 7–16',
    },
    {
      id: 'stage-7',
      stageNumber: 7,
      title: 'Final Snagging & Building Control Certificate',
      description: 'Turnkey handover, 10-year insurance-backed warranty, and council completion certificate.',
      status: 'UPCOMING',
      estimatedWeeks: 'Week 17',
    },
  ];
}

// Initial demo input 1: Extension & Kitchen in Ealing
const DEMO_INPUT_1: ComprehensivePlannerInput = {
  projectType: 'extension',
  customDescription:
    'We want to build a single storey rear extension with bifold doors, knock into the existing dining room, and install a modern open-plan kitchen with underfloor heating.',
  customerGoals: ['More space', 'Better layout', 'Modernise the property', 'Improve natural light & garden access'],
  propertyType: 'semi-detached',
  propertyAge: '1930_1960',
  postcode: 'W5 2UP',
  selectedAreas: [
    { id: 'area-1', name: 'Rear Extension', sizeCategory: 'medium', lengthMeters: 6, widthMeters: 4.5 },
    { id: 'area-2', name: 'Kitchen & Diner', sizeCategory: 'large', lengthMeters: 5, widthMeters: 4 },
  ],
  hasStructuralChanges: 'yes',
  isWallStructural: 'yes',
  finishLevel: 'premium',
  projectStatus: 'planning_approved',
  timeline: '1_3_months',
  budgetRange: '50k_100k',
};
const DEMO_ITEMS_1 = generateRoomByRoomScope(DEMO_INPUT_1);
const DEMO_RECS_1 = generateContextualRecommendations(DEMO_INPUT_1);
const DEMO_ESTIMATE_1 = calculateFullRoomQuote(DEMO_INPUT_1, DEMO_ITEMS_1, DEMO_RECS_1);

// Initial demo input 2: Full House Renovation in Richmond
const DEMO_INPUT_2: ComprehensivePlannerInput = {
  projectType: 'full-renovation',
  customDescription:
    'Complete Victorian period house renovation including rewiring, new heating system, new kitchen, two bathrooms and plastering throughout.',
  customerGoals: ['Modernise the property', 'Better layout', 'Increase property value', 'Improve energy efficiency'],
  propertyType: 'terraced',
  propertyAge: 'pre_1900',
  postcode: 'TW9 1TY',
  selectedAreas: [
    { id: 'area-3', name: 'Kitchen', sizeCategory: 'medium', lengthMeters: 4, widthMeters: 3.5 },
    { id: 'area-4', name: 'Main Bathroom', sizeCategory: 'medium', lengthMeters: 3, widthMeters: 2.5 },
    { id: 'area-5', name: 'Living Room', sizeCategory: 'large', lengthMeters: 6, widthMeters: 4 },
  ],
  hasStructuralChanges: 'yes',
  isWallStructural: 'yes',
  finishLevel: 'luxury',
  projectStatus: 'concept_stage',
  timeline: '3_6_months',
  budgetRange: '100k_plus',
};
const DEMO_ITEMS_2 = generateRoomByRoomScope(DEMO_INPUT_2);
const DEMO_RECS_2 = generateContextualRecommendations(DEMO_INPUT_2);
const DEMO_ESTIMATE_2 = calculateFullRoomQuote(DEMO_INPUT_2, DEMO_ITEMS_2, DEMO_RECS_2);

// In-Memory Database Store
class InMemoryDatabase {
  private users: DbCustomerUser[] = [
    {
      id: 'cust_demo_1',
      email: 'demo@stcontractors.co.uk',
      name: 'Oliver & Sophie Vance',
      phone: '07700 900123',
      postcode: 'W5 2UP',
      // Default demo password: 'Password123!'
      passwordHash: 'e6c2797fed830b96be6ff62f642fc3acb51f297a95ec01f814aa2e1e084e7300', // sha256 of Password123!
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-01-15T10:00:00.000Z',
    },
  ];

  private projects: DbProject[] = [
    {
      id: 'proj_demo_1',
      userId: 'cust_demo_1',
      leadId: 'lead_demo_1',
      referenceCode: 'ST-2026-1042',
      title: 'Ealing 6m Rear Extension & Open-Plan Kitchen',
      status: 'CONSULTATION_REQUESTED',
      inputData: DEMO_INPUT_1,
      scopeItems: DEMO_ITEMS_1,
      recommendations: DEMO_RECS_1,
      estimateResult: DEMO_ESTIMATE_1,
      timelineStages: generateDefaultTimelineStages('extension'),
      createdAt: '2026-01-15T10:30:00.000Z',
      updatedAt: '2026-01-15T10:30:00.000Z',
    },
    {
      id: 'proj_demo_2',
      leadId: 'lead_demo_2',
      referenceCode: 'ST-2026-2849',
      title: 'Richmond Victorian Period House Modernisation',
      status: 'SITE_SURVEY_SCHEDULED',
      inputData: DEMO_INPUT_2,
      scopeItems: DEMO_ITEMS_2,
      recommendations: DEMO_RECS_2,
      estimateResult: DEMO_ESTIMATE_2,
      timelineStages: generateDefaultTimelineStages('full-renovation'),
      createdAt: '2026-02-02T14:15:00.000Z',
      updatedAt: '2026-02-02T14:15:00.000Z',
    },
  ];

  private savedCalculations: DbSavedCalculation[] = [
    {
      id: 'calc_demo_1',
      userId: 'cust_demo_1',
      calculatorSlug: 'brick-calculator',
      calculatorTitle: 'Brick Quantity Calculator',
      category: 'masonry',
      inputs: { lengthMeters: 6, heightMeters: 2.4, wallType: 'double', wastePercentage: 10 },
      outputs: {
        primaryQuantity: '1,901 bricks',
        unit: 'Standard UK Facing Bricks',
        priceRange: '£1,425 – £2,280',
        breakdown: [
          { label: 'Facing Bricks', value: '1,901 units' },
          { label: 'Building Sand', value: '20 bags (25kg)' },
          { label: 'Cement Bags', value: '5 bags (25kg)' },
        ],
        assumptions: ['60 bricks/m² per single skin', '10mm mortar joint thickness'],
      },
      savedAt: '2026-02-10T11:00:00.000Z',
    },
  ];

  private customerDocuments: DbCustomerDocument[] = [
    {
      id: 'doc_demo_1',
      userId: 'cust_demo_1',
      projectId: 'proj_demo_1',
      fileName: 'Ground-Floor-Extension-Concept-Drawing.pdf',
      fileSize: 2450000,
      fileType: 'application/pdf',
      category: 'ARCHITECTURAL_DRAWING',
      fileUrl: '/uploads/demo-architectural-drawing.pdf',
      notes: 'Initial 1:50 scale drawing showing proposed bifold door opening.',
      uploadedAt: '2026-02-12T16:20:00.000Z',
    },
  ];

  private leads: DbLead[] = [
    {
      id: 'lead_demo_1',
      projectId: 'proj_demo_1',
      referenceCode: 'ST-2026-1042',
      firstName: 'Oliver',
      lastName: 'Vance',
      email: 'demo@stcontractors.co.uk',
      phone: '07700 900123',
      postcode: 'W5 2UP',
      projectType: 'extension',
      budgetRange: '50k_100k',
      estimatedValue: DEMO_ESTIMATE_1.indicativeCostHigh,
      timeline: '1_3_months',
      score: 85,
      scoreBand: 'HOT',
      scoreFactors: [
        { factor: 'Detailed Room Scope Configured', points: 30, description: '2 areas configured' },
        { factor: 'High-Value Project (£50k+)', points: 25, description: 'Indicative £50k+' },
        { factor: 'Core Service Area (Ealing)', points: 20, description: 'W5 West London' },
        { factor: 'Immediate Timeline (1-3 mos)', points: 10, description: 'Q1 Start Date' },
      ],
      stage: 'consultation_booked',
      source: 'Plan My Project',
      preferredContactMethod: 'phone',
      consultationType: 'consultation',
      requestedDate: '2026-03-02',
      requestedTimeSlot: '10:00 - 12:00',
      customerDescription: DEMO_INPUT_1.customDescription,
      notesHistory: [
        {
          id: 'note-1',
          author: 'System',
          text: 'Lead created via interactive quote planner with detailed 2-room scope.',
          createdAt: '2026-01-15T10:30:00.000Z',
        },
      ],
      createdAt: '2026-01-15T10:30:00.000Z',
      updatedAt: '2026-01-15T10:30:00.000Z',
    },
    {
      id: 'lead_demo_2',
      projectId: 'proj_demo_2',
      referenceCode: 'ST-2026-2849',
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'm.sterling@example.co.uk',
      phone: '07700 900456',
      postcode: 'TW9 1TY',
      projectType: 'full-renovation',
      budgetRange: '100k_plus',
      estimatedValue: DEMO_ESTIMATE_2.indicativeCostHigh,
      timeline: '3_6_months',
      score: 92,
      scoreBand: 'HOT',
      scoreFactors: [
        { factor: 'Detailed Room Scope Configured', points: 30, description: '3 areas configured' },
        { factor: 'High-Value Project (£100k+)', points: 25, description: 'Indicative £100k+' },
        { factor: 'Core Service Area (Richmond)', points: 20, description: 'TW9 South West London' },
        { factor: 'Structural Overhaul Included', points: 17, description: 'Load bearing wall removals' },
      ],
      stage: 'site_visit_booked',
      source: 'Plan My Project',
      preferredContactMethod: 'email',
      consultationType: 'site_visit',
      requestedDate: '2026-03-05',
      requestedTimeSlot: '14:00 - 16:00',
      customerDescription: DEMO_INPUT_2.customDescription,
      notesHistory: [
        {
          id: 'note-2',
          author: 'System',
          text: 'Lead created via interactive quote planner. Victorian period property overhaul.',
          createdAt: '2026-02-02T14:15:00.000Z',
        },
      ],
      createdAt: '2026-02-02T14:15:00.000Z',
      updatedAt: '2026-02-02T14:15:00.000Z',
    },
  ];

  private consultations: DbConsultation[] = [
    {
      id: 'cons_demo_1',
      userId: 'cust_demo_1',
      leadId: 'lead_demo_1',
      projectId: 'proj_demo_1',
      referenceCode: 'ST-2026-1042',
      type: 'consultation',
      requestedDate: '2026-03-02',
      requestedTimeSlot: '10:00 - 12:00',
      status: 'confirmed',
      assignedSurveyor: 'David Evans (Senior Project Director)',
      notes: 'Initial video architectural consultation to review bifold span and foundation depth.',
      createdAt: '2026-01-15T10:30:00.000Z',
    },
  ];

  private analyticsEvents: DbAnalyticsEvent[] = [];
  private contactSubmissions: DbContactSubmission[] = [];

  // =========================================================================
  // CUSTOMER USER REPOSITORY
  // =========================================================================

  public async createCustomerUser(user: {
    name: string;
    email: string;
    phone?: string;
    postcode?: string;
    passwordHash: string;
  }): Promise<DbCustomerUser> {
    const existing = await this.findCustomerByEmail(user.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: DbCustomerUser = {
      id: `cust_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: user.name.trim(),
      email: user.email.toLowerCase().trim(),
      phone: user.phone?.trim(),
      postcode: user.postcode?.trim().toUpperCase(),
      passwordHash: user.passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    return newUser;
  }

  public async findCustomerByEmail(email: string): Promise<DbCustomerUser | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public async findCustomerById(id: string): Promise<DbCustomerUser | undefined> {
    return this.users.find((u) => u.id === id);
  }

  // =========================================================================
  // CUSTOMER PROJECT REPOSITORY
  // =========================================================================

  public async saveProjectForCustomer(
    userId: string,
    projectData: {
      title?: string;
      inputData: ComprehensivePlannerInput;
      scopeItems: ProjectScopeItem[];
      recommendations: RecommendedWorkItem[];
      estimateResult: FullProjectQuoteEstimate;
      notes?: string;
    }
  ): Promise<DbProject> {
    const refCode = generateRefCode();
    const title =
      projectData.title ||
      `${projectData.inputData.postcode || 'London'} ${projectData.inputData.projectType.replace('-', ' ').toUpperCase()} Project`;

    const newProj: DbProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      referenceCode: refCode,
      title,
      status: 'ESTIMATE_SAVED',
      inputData: projectData.inputData,
      scopeItems: projectData.scopeItems,
      recommendations: projectData.recommendations,
      estimateResult: projectData.estimateResult,
      timelineStages: generateDefaultTimelineStages(projectData.inputData.projectType),
      notes: projectData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.unshift(newProj);
    return newProj;
  }

  public async getCustomerProjects(userId: string): Promise<DbProject[]> {
    return this.projects.filter((p) => p.userId === userId);
  }

  public async getCustomerProjectById(projectId: string, userId: string): Promise<DbProject | undefined> {
    return this.projects.find((p) => p.id === projectId && p.userId === userId);
  }

  public async updateCustomerProject(
    projectId: string,
    userId: string,
    updates: Partial<DbProject>
  ): Promise<DbProject | undefined> {
    const proj = await this.getCustomerProjectById(projectId, userId);
    if (!proj) return undefined;

    Object.assign(proj, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return proj;
  }

  public async deleteCustomerProject(projectId: string, userId: string): Promise<boolean> {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter((p) => !(p.id === projectId && p.userId === userId));
    return this.projects.length < initialLen;
  }

  // =========================================================================
  // SAVED CALCULATIONS REPOSITORY
  // =========================================================================

  public async saveCalculationForCustomer(
    userId: string,
    calc: {
      calculatorSlug: string;
      calculatorTitle: string;
      category: string;
      inputs: Record<string, any>;
      outputs: DbSavedCalculation['outputs'];
    }
  ): Promise<DbSavedCalculation> {
    const item: DbSavedCalculation = {
      id: `calc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      calculatorSlug: calc.calculatorSlug,
      calculatorTitle: calc.calculatorTitle,
      category: calc.category,
      inputs: calc.inputs,
      outputs: calc.outputs,
      savedAt: new Date().toISOString(),
    };

    this.savedCalculations.unshift(item);
    return item;
  }

  public async getCustomerCalculations(userId: string): Promise<DbSavedCalculation[]> {
    return this.savedCalculations.filter((c) => c.userId === userId);
  }

  public async deleteCustomerCalculation(calcId: string, userId: string): Promise<boolean> {
    const initialLen = this.savedCalculations.length;
    this.savedCalculations = this.savedCalculations.filter((c) => !(c.id === calcId && c.userId === userId));
    return this.savedCalculations.length < initialLen;
  }

  // =========================================================================
  // CUSTOMER DOCUMENTS REPOSITORY
  // =========================================================================

  public async uploadCustomerDocument(
    userId: string,
    doc: {
      projectId?: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      category: DbCustomerDocument['category'];
      fileUrl: string;
      notes?: string;
    }
  ): Promise<DbCustomerDocument> {
    const item: DbCustomerDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      projectId: doc.projectId,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      category: doc.category,
      fileUrl: doc.fileUrl,
      notes: doc.notes,
      uploadedAt: new Date().toISOString(),
    };

    this.customerDocuments.unshift(item);
    return item;
  }

  public async getCustomerDocuments(userId: string, projectId?: string): Promise<DbCustomerDocument[]> {
    return this.customerDocuments.filter(
      (d) => d.userId === userId && (!projectId || d.projectId === projectId)
    );
  }

  public async deleteCustomerDocument(docId: string, userId: string): Promise<boolean> {
    const initialLen = this.customerDocuments.length;
    this.customerDocuments = this.customerDocuments.filter((d) => !(d.id === docId && d.userId === userId));
    return this.customerDocuments.length < initialLen;
  }

  // =========================================================================
  // CUSTOMER CONSULTATIONS REPOSITORY
  // =========================================================================

  public async getCustomerConsultations(userId: string): Promise<DbConsultation[]> {
    return this.consultations.filter((c) => c.userId === userId);
  }

  public async requestCustomerConsultation(
    userId: string,
    data: {
      projectId?: string;
      type: DbConsultation['type'];
      requestedDate?: string;
      requestedTimeSlot?: string;
      notes?: string;
    }
  ): Promise<DbConsultation> {
    const refCode = generateRefCode();
    const item: DbConsultation = {
      id: `cons_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      projectId: data.projectId,
      referenceCode: refCode,
      type: data.type,
      requestedDate: data.requestedDate,
      requestedTimeSlot: data.requestedTimeSlot,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    this.consultations.unshift(item);

    // Update project status if linked
    if (data.projectId) {
      await this.updateCustomerProject(data.projectId, userId, {
        status: 'CONSULTATION_REQUESTED',
      });
    }

    return item;
  }

  // =========================================================================
  // CRM / ADMIN LEADS METHODS
  // =========================================================================

  public async createLeadFromPlanner(
    leadData: Omit<DbLead, 'id' | 'projectId' | 'referenceCode' | 'score' | 'scoreBand' | 'scoreFactors' | 'stage' | 'notesHistory' | 'createdAt' | 'updatedAt'>,
    projectData: {
      inputData: ComprehensivePlannerInput;
      scopeItems: ProjectScopeItem[];
      recommendations: RecommendedWorkItem[];
      estimateResult: FullProjectQuoteEstimate;
    }
  ): Promise<{ lead: DbLead; project: DbProject }> {
    const refCode = generateRefCode();
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const projectTitle = `${leadData.postcode} ${projectData.inputData.projectType.replace('-', ' ').toUpperCase()} Scope`;

    const project: DbProject = {
      id: projectId,
      leadId,
      referenceCode: refCode,
      title: projectTitle,
      status: 'CONSULTATION_REQUESTED',
      inputData: projectData.inputData,
      scopeItems: projectData.scopeItems,
      recommendations: projectData.recommendations,
      estimateResult: projectData.estimateResult,
      timelineStages: generateDefaultTimelineStages(projectData.inputData.projectType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const planInput: any = {
      projectType: projectData.inputData.projectType as any,
      propertyType: (projectData.inputData.propertyType || 'semi-detached') as any,
      postcode: leadData.postcode || projectData.inputData.postcode,
      status: (projectData.inputData.projectStatus || 'ready_to_plan') as any,
      timeline: (leadData.timeline || projectData.inputData.timeline || '1_3_months') as any,
      budgetRange: (leadData.budgetRange || projectData.inputData.budgetRange || '50k_100k') as any,
      requirements: projectData.inputData.customerGoals || [],
      finishLevel: (projectData.inputData.finishLevel || 'standard') as any,
    };

    const leadScoreResult = computeLeadScore(planInput, Boolean(leadData.consultationType));

    const lead: DbLead = {
      ...leadData,
      id: leadId,
      projectId,
      referenceCode: refCode,
      score: leadScoreResult.score,
      scoreBand: leadScoreResult.scoreBand,
      scoreFactors: leadScoreResult.factors,
      stage: 'new',
      notesHistory: [
        {
          id: `note_${Date.now()}`,
          author: 'System',
          text: `Lead created via Plan My Project with estimate £${projectData.estimateResult.indicativeCostLow.toLocaleString()} – £${projectData.estimateResult.indicativeCostHigh.toLocaleString()}`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.unshift(project);
    this.leads.unshift(lead);

    if (leadData.consultationType) {
      this.consultations.unshift({
        id: `cons_${Date.now()}`,
        leadId,
        projectId,
        referenceCode: refCode,
        type: leadData.consultationType,
        requestedDate: leadData.requestedDate,
        requestedTimeSlot: leadData.requestedTimeSlot,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    return { lead, project };
  }

  public async createLeadWithRoomProject(params: {
    inputData: ComprehensivePlannerInput;
    scopeItems: ProjectScopeItem[];
    recommendations: RecommendedWorkItem[];
    estimateResult: FullProjectQuoteEstimate;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      preferredContactMethod?: 'phone' | 'email';
      consultationType?: 'consultation' | 'callback' | 'site_visit';
      requestedDate?: string;
      requestedTimeSlot?: string;
      notes?: string;
    };
    source?: string;
  }): Promise<{ lead: DbLead; project: DbProject }> {
    return this.createLeadFromPlanner(
      {
        firstName: params.contact.firstName,
        lastName: params.contact.lastName,
        email: params.contact.email,
        phone: params.contact.phone,
        postcode: params.inputData.postcode || 'W5 2UP',
        projectType: params.inputData.projectType,
        budgetRange: params.inputData.budgetRange || '50k_100k',
        estimatedValue: params.estimateResult.indicativeCostHigh,
        timeline: params.inputData.timeline || '1_3_months',
        source: params.source || 'Contact Form',
        preferredContactMethod: params.contact.preferredContactMethod || 'phone',
        consultationType: params.contact.consultationType || 'consultation',
        requestedDate: params.contact.requestedDate,
        requestedTimeSlot: params.contact.requestedTimeSlot,
        customerDescription: params.contact.notes,
      },
      {
        inputData: params.inputData,
        scopeItems: params.scopeItems,
        recommendations: params.recommendations,
        estimateResult: params.estimateResult,
      }
    );
  }

  public async createLeadFromCalculatorConsultation(params: {
    calculator: {
      slug: string;
      name: string;
      category: string;
      primaryLabel: string;
      formattedPrimary: string;
      primaryUnit: string;
      indicativeCostLow: number;
      indicativeCostHigh: number;
      inputs: Record<string, any>;
      materials?: any[];
    };
    qualification: {
      postcode: string;
      propertyType?: string;
      planningStatus: string;
      budgetRange: string;
      timeline: string;
    };
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      consultationType: 'site_visit' | 'consultation' | 'callback';
      requestedDate?: string;
      requestedTimeSlot?: string;
      notes?: string;
    };
    userId?: string;
  }): Promise<{ lead: DbLead; project: DbProject; consultation: DbConsultation }> {
    const refCode = generateRefCode();
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Derive project type (e.g. extension, loft, kitchen, full-renovation)
    let pType = 'extension';
    if (params.calculator.slug.includes('loft')) pType = 'loft';
    else if (params.calculator.slug.includes('kitchen')) pType = 'kitchen';
    else if (params.calculator.slug.includes('renovation')) pType = 'full-renovation';
    else if (
      params.calculator.slug.includes('brick') ||
      params.calculator.slug.includes('block') ||
      params.calculator.slug.includes('concrete')
    )
      pType = 'extension';

    const projectTitle = `${params.qualification.postcode} ${params.calculator.name} (${params.calculator.formattedPrimary})`;

    const plannerInput: ComprehensivePlannerInput = {
      projectType: pType,
      customDescription: `Calculator Consultation from ${params.calculator.name}. Primary calculation: ${params.calculator.formattedPrimary}. Planning status: ${params.qualification.planningStatus.replace(/_/g, ' ')}. Budget: ${params.qualification.budgetRange.replace(/_/g, ' ')}. Timeline: ${params.qualification.timeline.replace(/_/g, ' ')}.`,
      customerGoals: ['Professional build & project management', 'Planning & structural compliance'],
      propertyType: params.qualification.propertyType || 'semi-detached',
      propertyAge: '1930_1960',
      postcode: params.qualification.postcode,
      selectedAreas: [{ id: 'area-calc-1', name: `${params.calculator.name} Scope`, sizeCategory: 'medium' }],
      finishLevel: 'standard',
      projectStatus: params.qualification.planningStatus,
      timeline: params.qualification.timeline,
      budgetRange: params.qualification.budgetRange,
    };

    const estLow = params.calculator.indicativeCostLow || 45000;
    const estHigh = params.calculator.indicativeCostHigh || Math.round(estLow * 1.25);

    const estimateResult: FullProjectQuoteEstimate = {
      projectTitle,
      summaryText: `Calculator-driven estimate for ${params.calculator.formattedPrimary} based on current London benchmark rates.`,
      indicativeCostLow: estLow,
      indicativeCostHigh: estHigh,
      averageCost: Math.round((estLow + estHigh) / 2),
      contingencyAmount: Math.round(estLow * 0.1),
      durationWeeksMin: 6,
      durationWeeksMax: 14,
      roomBreakdowns: [
        {
          areaName: `${params.calculator.name} Main Scope`,
          itemCount: params.calculator.materials?.length || 1,
          costLow: estLow,
          costHigh: estHigh,
        },
      ],
      categoryBreakdowns: [
        { category: 'Building & Structural', costLow: Math.round(estLow * 0.6), costHigh: Math.round(estHigh * 0.6), percentage: 60 },
        { category: 'Finishing & Fit-Out', costLow: Math.round(estLow * 0.4), costHigh: Math.round(estHigh * 0.4), percentage: 40 },
      ],
      timelinePhases: [
        { phaseNumber: 1, name: 'Site Survey & Laser Measure', duration: '1 week', description: 'Confirm structural loadings & dimensions' },
        { phaseNumber: 2, name: 'Procurement & Groundworks', duration: '3-4 weeks', description: 'Excavation, concrete & steels' },
        { phaseNumber: 3, name: 'Structural Build & Fit-Out', duration: '6-8 weeks', description: 'Brickwork, glazing, roof & interiors' },
      ],
      thingsToConfirm: ['Laser measure on site', 'Underground drainage & party wall confirmation'],
      confidenceRating: 'High',
      isDevelopmentDemo: false,
    };

    const scopeItems: ProjectScopeItem[] = (params.calculator.materials || []).map((m: any, idx: number) => ({
      id: `item_calc_${idx}`,
      areaId: 'area-calc-1',
      areaName: 'Primary Work Item',
      category: 'Building & Structural',
      name: m.name,
      description: `${m.formattedQuantity} (${m.notes || 'Calculated requirement'})`,
      selected: true,
      pricingStatus: 'estimated',
      costLow: Math.round(estLow / (params.calculator.materials?.length || 1)),
      costHigh: Math.round(estHigh / (params.calculator.materials?.length || 1)),
    }));

    const project: DbProject = {
      id: projectId,
      userId: params.userId,
      leadId,
      referenceCode: refCode,
      title: projectTitle,
      status: 'CONSULTATION_REQUESTED',
      inputData: plannerInput,
      scopeItems,
      recommendations: [],
      estimateResult,
      timelineStages: generateDefaultTimelineStages(pType),
      notes: JSON.stringify({
        calculatorSlug: params.calculator.slug,
        calculatorInputs: params.calculator.inputs,
        primaryResult: params.calculator.formattedPrimary,
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const planScoreInput: any = {
      projectType: pType,
      propertyType: params.qualification.propertyType || 'semi-detached',
      postcode: params.qualification.postcode,
      status: params.qualification.planningStatus,
      timeline: params.qualification.timeline,
      budgetRange: params.qualification.budgetRange,
      requirements: ['Turnkey structural management'],
      finishLevel: 'standard',
    };

    const leadScoreResult = computeLeadScore(planScoreInput, true);

    const lead: DbLead = {
      id: leadId,
      projectId,
      referenceCode: refCode,
      firstName: params.contact.firstName,
      lastName: params.contact.lastName,
      email: params.contact.email,
      phone: params.contact.phone,
      postcode: params.qualification.postcode,
      projectType: pType,
      budgetRange: params.qualification.budgetRange,
      estimatedValue: estHigh,
      timeline: params.qualification.timeline,
      score: leadScoreResult.score,
      scoreBand: leadScoreResult.scoreBand,
      scoreFactors: leadScoreResult.factors,
      stage: 'consultation_booked',
      source: `Calculator: ${params.calculator.name}`,
      preferredContactMethod: 'phone',
      consultationType: params.contact.consultationType,
      requestedDate: params.contact.requestedDate,
      requestedTimeSlot: params.contact.requestedTimeSlot,
      customerDescription: `Direct Calculator Consultation (${params.calculator.name} • ${params.calculator.formattedPrimary}). Planning: ${params.qualification.planningStatus}. Budget: ${params.qualification.budgetRange}. Timeline: ${params.qualification.timeline}. ${params.contact.notes ? `Client notes: ${params.contact.notes}` : ''}`,
      notesHistory: [
        {
          id: `note_${Date.now()}`,
          author: 'Calculator Lead Engine',
          text: `HOT LEAD captured via ${params.calculator.name}. Primary calculation: ${params.calculator.formattedPrimary}. Estimated guide: £${estLow.toLocaleString()} – £${estHigh.toLocaleString()}. Requested: ${params.contact.consultationType.replace(/_/g, ' ').toUpperCase()}`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const consultation: DbConsultation = {
      id: `cons_${Date.now()}`,
      leadId,
      projectId,
      userId: params.userId,
      referenceCode: refCode,
      type: params.contact.consultationType,
      requestedDate: params.contact.requestedDate,
      requestedTimeSlot: params.contact.requestedTimeSlot,
      status: 'pending',
      notes: `Calculator Consultation: ${params.calculator.name} (${params.calculator.formattedPrimary})`,
      createdAt: new Date().toISOString(),
    };

    this.projects.unshift(project);
    this.leads.unshift(lead);
    this.consultations.unshift(consultation);

    return { lead, project, consultation };
  }

  public async getLeads(filter?: {
    stage?: string;
    scoreBand?: string;
    search?: string;
  }): Promise<DbLead[]> {
    let list = [...this.leads];

    if (filter?.stage && filter.stage !== 'all') {
      list = list.filter((l) => l.stage === filter.stage);
    }

    if (filter?.scoreBand && filter.scoreBand !== 'all') {
      list = list.filter((l) => l.scoreBand === filter.scoreBand);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.firstName.toLowerCase().includes(q) ||
          l.lastName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.postcode.toLowerCase().includes(q) ||
          l.referenceCode.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public async getContactSubmissions(): Promise<DbContactSubmission[]> {
    return this.contactSubmissions;
  }

  public async getLeadById(id: string): Promise<DbLead | undefined> {
    return this.leads.find((l) => l.id === id);
  }

  public async getProjectById(id: string): Promise<DbProject | undefined> {
    return this.projects.find((p) => p.id === id);
  }

  public async getProjectByLeadId(leadId: string): Promise<DbProject | undefined> {
    return this.projects.find((p) => p.leadId === leadId);
  }

  public async updateLeadStage(id: string, stage: CrmStage): Promise<DbLead | undefined> {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return undefined;

    lead.stage = stage;
    lead.updatedAt = new Date().toISOString();
    lead.notesHistory.unshift({
      id: `note_${Date.now()}`,
      author: 'Admin',
      text: `Stage changed to "${stage.replace('_', ' ').toUpperCase()}"`,
      createdAt: new Date().toISOString(),
    });

    return lead;
  }

  public async addLeadNote(id: string, author: string, text: string): Promise<DbLead | undefined> {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return undefined;

    lead.notesHistory.unshift({
      id: `note_${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString(),
    });
    lead.updatedAt = new Date().toISOString();

    return lead;
  }

  public async logAnalyticsEvent(event: Omit<DbAnalyticsEvent, 'id' | 'createdAt'>): Promise<DbAnalyticsEvent> {
    const newEvent: DbAnalyticsEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.analyticsEvents.push(newEvent);
    return newEvent;
  }

  public async createContactSubmission(
    submission: Omit<DbContactSubmission, 'id' | 'createdAt'>
  ): Promise<DbContactSubmission> {
    const newSubmission: DbContactSubmission = {
      ...submission,
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.contactSubmissions.unshift(newSubmission);
    return newSubmission;
  }

  public async addContactSubmission(
    submission: Omit<DbContactSubmission, 'id' | 'createdAt'>
  ): Promise<DbContactSubmission> {
    return this.createContactSubmission(submission);
  }

  // --- UNIFIED PROJECT PROFILE METHODS (Phase 1 Master Spec) ---
  private unifiedProfiles: import('@/types/project-profile').UnifiedProjectProfile[] = [];

  public async saveUnifiedProfile(
    profile: Partial<import('@/types/project-profile').UnifiedProjectProfile>
  ): Promise<import('@/types/project-profile').UnifiedProjectProfile> {
    const now = new Date().toISOString();
    const id = profile.id || `ST-PROJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const refCode = profile.referenceCode || `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const existingIndex = this.unifiedProfiles.findIndex((p) => p.id === id || (profile.sessionId && p.sessionId === profile.sessionId));

    const defaultProfile: import('@/types/project-profile').UnifiedProjectProfile = {
      id,
      sessionId: profile.sessionId || 'anon_session',
      referenceCode: refCode,
      createdAt: profile.createdAt || now,
      updatedAt: now,
      attribution: profile.attribution || {
        source: 'direct',
        originalLandingPage: '/',
        firstTouchTimestamp: now,
        lastTouchTimestamp: now,
      },
      location: profile.location || {},
      propertyType: profile.propertyType || 'terraced',
      projectTypes: profile.projectTypes || ['extension'],
      rooms: profile.rooms || [],
      scopeItems: profile.scopeItems || [],
      customScopeAdditions: profile.customScopeAdditions || [],
      customerGoals: profile.customerGoals || [],
      specificationTier: profile.specificationTier || 'recommended',
      timelineTarget: profile.timelineTarget || '1_to_3_months',
      occupiedDuringWorks: profile.occupiedDuringWorks ?? true,
      planningStatus: profile.planningStatus || 'unknown',
      hasDrawings: profile.hasDrawings ?? false,
      hasStructuralCalculations: profile.hasStructuralCalculations ?? false,
      uploads: profile.uploads || [],
      estimate: profile.estimate || {
        low: 50000,
        expected: 65000,
        high: 80000,
        currency: 'GBP',
        breakdown: {
          materialsTotal: 25000,
          labourTotal: 30000,
          wasteAndDisposal: 2500,
          structuralSteelAllowance: 3500,
          prelimsAndManagement: 2000,
          contingency: 2000,
        },
      },
      confidenceLevel: profile.confidenceLevel || 'MEDIUM',
      confidenceAssumptions: profile.confidenceAssumptions || [
        'Indicative preliminary estimates based on standard London ground conditions',
      ],
      readiness: profile.readiness || {
        score: 65,
        status: 'SCOPING',
        completedItems: ['Project Type', 'Property Type'],
        missingItems: ['Floorplan or Room Dimensions'],
        optionalNextSteps: ['Upload Photographs for Expert Review'],
      },
      aiRecommendations: profile.aiRecommendations || [],
      riskFlags: profile.riskFlags || [],
      savedByCustomer: profile.savedByCustomer ?? false,
      professionalReviewRequested: profile.professionalReviewRequested ?? false,
    };

    if (existingIndex >= 0) {
      this.unifiedProfiles[existingIndex] = {
        ...this.unifiedProfiles[existingIndex],
        ...profile,
        updatedAt: now,
      };
      return this.unifiedProfiles[existingIndex];
    } else {
      this.unifiedProfiles.unshift(defaultProfile);
      return defaultProfile;
    }
  }

  public async getUnifiedProfile(idOrSessionId: string): Promise<import('@/types/project-profile').UnifiedProjectProfile | undefined> {
    return this.unifiedProfiles.find((p) => p.id === idOrSessionId || p.sessionId === idOrSessionId);
  }
}

export const db = new InMemoryDatabase();
