import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, CheckCircle2, Calculator, ShieldCheck, Sparkles } from 'lucide-react';

export interface ServiceVideoConfig {
  videoSrc: string;
  posterSrc?: string;
  badge: string;
  title: string;
  subtitle: string;
  tradePoints: Array<{
    title: string;
    description: string;
  }>;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export const SERVICE_VIDEO_CONFIGS: Record<string, ServiceVideoConfig> = {
  extensions: {
    videoSrc: '/videos/bifold-doors-opening.mp4',
    badge: 'ARCHITECTURAL GLAZING & INDOOR-OUTDOOR LIVING',
    title: 'Seamless Flow from Open-Plan Living to Landscaped Garden',
    subtitle:
      'A structural rear extension is only as good as its threshold execution. Our in-house team engineers steel frames for flush-level transitions with integrated subterranean drainage.',
    tradePoints: [
      {
        title: 'Structural Goalpost Steel Frames',
        description:
          'Eliminates interior load-bearing posts to achieve unobstructed wall-to-wall spans up to 7.5 meters.',
      },
      {
        title: 'Zero-Step Flush Thresholds',
        description:
          'Precision-rebated aluminium tracks with subterranean ACO drainage preventing water ingress.',
      },
      {
        title: 'Acoustic & Solar-Control Glazing',
        description:
          'Low-E toughened double or triple glazing delivering thermal performance with U-values down to 1.1 W/m²K.',
      },
    ],
    primaryCtaText: 'Plan My House Extension',
    primaryCtaHref: '/plan-my-project?service=extensions',
    secondaryCtaText: 'Calculate Extension Cost',
    secondaryCtaHref: '/calculators/extension-calculator',
  },
  renovations: {
    videoSrc: '/videos/home-renovation-tour.mp4',
    badge: 'TURNKEY WHOLE-HOUSE METAMORPHOSIS',
    title: 'Cohesive Architectural Flow Across Every Floor',
    subtitle:
      'From period hallway restoration and acoustic subfloor cassettes to open-plan living, we orchestrate the complete strip-out, structural alteration, and luxury fit-out under one accountable contract.',
    tradePoints: [
      {
        title: 'Complete Re-Engineering',
        description:
          'Full structural alterations, chimney breast removals, and Thames Water build-overs signed off by Building Control.',
      },
      {
        title: 'Integrated MEP Infrastructure',
        description:
          'Complete rewiring, zoned wet underfloor heating (UFH), and unvented megaflow hot water cylinders.',
      },
      {
        title: 'Period Detailing Restored',
        description:
          'Bespoke plaster cornicing, engineered chevron oak flooring, and hand-finished architectural joinery.',
      },
    ],
    primaryCtaText: 'Plan My Whole-House Renovation',
    primaryCtaHref: '/plan-my-project?service=renovations',
    secondaryCtaText: 'Calculate Renovation Cost',
    secondaryCtaHref: '/calculators/renovation-calculator',
  },
  'kitchen-renovations': {
    videoSrc: '/videos/kitchen-coffee-island.mp4',
    badge: 'BESPOKE CULINARY ARCHITECTURE',
    title: 'The Architectural Centerpiece of the Modern Home',
    subtitle:
      'We design and construct luxury kitchen-diners with bespoke cabinetry, integrated structural knock-throughs, and flawless stone worktops engineered for everyday family living and entertaining.',
    tradePoints: [
      {
        title: 'Knock-Through Spatial Design',
        description:
          'Opening compartmentalized ground floors into expansive, sociable open-plan kitchen and dining zones.',
      },
      {
        title: 'Bookmatched Quartz & Sintered Stone',
        description:
          'Precision mitred 40mm/50mm waterfall island returns with flush-mounted induction hobs.',
      },
      {
        title: 'Concealed Pantries & Utility Flow',
        description:
          'Seamless handleless cabinetry with pocket doors and whisper-quiet downdraft extraction.',
      },
    ],
    primaryCtaText: 'Plan My Kitchen Renovation',
    primaryCtaHref: '/plan-my-project?service=kitchen-renovations',
    secondaryCtaText: 'Calculate Kitchen Cost',
    secondaryCtaHref: '/calculators/kitchen-calculator',
  },
  'bathroom-renovations': {
    videoSrc: '/videos/stone-bathroom-reveal.mp4',
    badge: 'PRECISION STONE & WET-ROOM ENGINEERING',
    title: 'Spa-Grade Sanctuary with 100% Waterproof Integrity',
    subtitle:
      'Luxury bathrooms demand obsessive engineering behind the tiles. We install complete secondary waterproofing membranes, unvented high-pressure brassware, and recessed architectural lighting.',
    tradePoints: [
      {
        title: 'Dual-Coat Tanking Membrane',
        description:
          'Complete wetroom tanking backed by our 10-year leak-free warranty and pressure-tested pipework.',
      },
      {
        title: 'Laser-Mitred 45° Stone Detailing',
        description:
          'Full-body porcelain and natural marble with invisible epoxy grouting and recessed illuminated niches.',
      },
      {
        title: 'Concealed Thermostatic Infrastructure',
        description:
          'Wall-hung sanitaryware, concealed Geberit cisterns, and high-flow rainwater showers.',
      },
    ],
    primaryCtaText: 'Plan My Bathroom Renovation',
    primaryCtaHref: '/plan-my-project?service=bathroom-renovations',
    secondaryCtaText: 'Calculate Bathroom Cost',
    secondaryCtaHref: '/calculators/bathroom-calculator',
  },
  'loft-conversions': {
    videoSrc: '/videos/loft-conversion-reveal.mp4',
    badge: 'MAXIMUM STATUTORY HEAD HEIGHT & NATURAL LIGHT',
    title: 'Elevate Your Living Space with an Architectural Master Suite',
    subtitle:
      'Convert unused London attic space into light-drenched master bedroom suites, walk-in dressing areas, and luxury ensuites under Permitted Development or full planning.',
    tradePoints: [
      {
        title: 'Structural Steel Ridge Alignment',
        description:
          'Engineered steel beams installed to maximize statutory 2.2m+ clear headroom throughout the floor.',
      },
      {
        title: 'Rear Dormer & Mansard Detailing',
        description:
          'Zinc or slate external cladding with floor-to-ceiling Juliet balconies and frameless rooflights.',
      },
      {
        title: 'Acoustic Floor Decoupling',
        description:
          'Independent resilient bar joist acoustic insulation ensuring silence for the bedrooms below.',
      },
    ],
    primaryCtaText: 'Plan My Loft Conversion',
    primaryCtaHref: '/plan-my-project?service=loft-conversions',
    secondaryCtaText: 'Calculate Loft Cost',
    secondaryCtaHref: '/calculators/loft-calculator',
  },
  'garden-rooms': {
    videoSrc: '/videos/garden-office-study.mp4',
    badge: 'FOUR-SEASON ARCHITECTURAL LIVING',
    title: 'High-Performance Garden Offices, Studios & Gyms',
    subtitle:
      'Extend your habitable living space without disturbing the main residence. Built to full residential Building Regulations standards for year-round comfort.',
    tradePoints: [
      {
        title: 'Engineered SIPs Thermal Envelope',
        description:
          '100mm structural insulated panels delivering superior thermal insulation and rapid construction.',
      },
      {
        title: 'Dedicated Armored Power & Cat6',
        description:
          'Direct subterranean utility trenching supporting high-speed fibre internet and climate control.',
      },
      {
        title: 'Architectural Cladding & Slimline Glazing',
        description:
          'UV-stabilized Western Red Cedar or charred larch with aluminium sliding doors.',
      },
    ],
    primaryCtaText: 'Plan My Garden Room',
    primaryCtaHref: '/plan-my-project?service=garden-rooms',
    secondaryCtaText: 'Calculate Garden Room Cost',
    secondaryCtaHref: '/calculators/garden-room-calculator',
  },
  'garage-conversions': {
    videoSrc: '/videos/bedroom-fitted-wardrobe.mp4',
    badge: 'UNLOCKING REDUNDANT FOOTPRINT',
    title: 'Turn Underused Garages into Luxury Master Suites & Living Rooms',
    subtitle:
      'A London garage is rarely used for vehicles. Converting this dry footprint into a luxury guest suite, home cinema, or playroom is the highest ROI home improvement available.',
    tradePoints: [
      {
        title: 'Sub-Floor Damp Proofing & PIR Insulation',
        description:
          '100mm rigid floor insulation and concrete screed flush with the main residence floors.',
      },
      {
        title: 'Cavity Wall Infill & Brick Matching',
        description:
          'Seamless exterior matching of existing brickwork and stone window headers.',
      },
      {
        title: 'Integrated Custom Joinery',
        description:
          'Maximizing every square meter with bespoke wardrobes, pocket doors, and climate control.',
      },
    ],
    primaryCtaText: 'Plan My Garage Conversion',
    primaryCtaHref: '/plan-my-project?service=garage-conversions',
    secondaryCtaText: 'Calculate Garage Cost',
    secondaryCtaHref: '/calculators/garage-calculator',
  },
  landscaping: {
    videoSrc: '/videos/london-garden-tour.mp4',
    badge: 'ARCHITECTURAL EXTERIOR LIVING',
    title: 'Contemporary Porcelain Patios & London Garden Architecture',
    subtitle:
      'Create an outdoor entertaining sanctuary that connects effortlessly to your home extension with laser-level porcelain paving, raised planters, and outdoor living zones.',
    tradePoints: [
      {
        title: 'Compaction-Tested Type 1 Sub-Base',
        description:
          'Laser-graded hardcore sub-base preventing settling, subsidence, or puddle formation.',
      },
      {
        title: 'Full Slurry-Primed Wet Bedding',
        description:
          '20mm external vitrified porcelain laid on bonding slurry for an unbreakable permanent bond.',
      },
      {
        title: 'Permeable SuDS Drainage & Lighting',
        description:
          'Concealed drainage channels and 12V zoned architectural garden mood lighting.',
      },
    ],
    primaryCtaText: 'Plan My Landscaping Project',
    primaryCtaHref: '/plan-my-project?service=landscaping',
    secondaryCtaText: 'Calculate Patio Cost',
    secondaryCtaHref: '/calculators/patio-calculator',
  },
  driveways: {
    videoSrc: '/videos/london-garden-tour.mp4',
    badge: 'HEAVY-DUTY SUB-BASE & KERB APPEAL',
    title: 'Engineered Driveways Built to Withstand Decades of Vehicle Load',
    subtitle:
      'From UV-stable resin-bound gravel to granite setts and permeable block paving, we engineer driveway sub-bases to exceed British Standards for load bearing and SuDS compliance.',
    tradePoints: [
      {
        title: 'Deep Excavation & Geotextile Membrane',
        description:
          'Heavy-duty woven membranes preventing weed migration and subsoil intermixing.',
      },
      {
        title: 'Open-Textured Permeable Binder Course',
        description:
          'Porous asphalt or MOT Type 3 sub-base delivering natural water drainage without planning permits.',
      },
      {
        title: 'Precision Edging Restraints',
        description:
          'Hydraulically pressed concrete or granite pin kerbs preventing edge spread under vehicle turning loads.',
      },
    ],
    primaryCtaText: 'Plan My Driveway Project',
    primaryCtaHref: '/plan-my-project?service=driveways',
    secondaryCtaText: 'Calculate Driveway Cost',
    secondaryCtaHref: '/calculators/driveway-calculator',
  },
};

interface ServiceVideoShowcaseProps {
  slug: string;
}

export function ServiceVideoShowcase({ slug }: ServiceVideoShowcaseProps) {
  const config = SERVICE_VIDEO_CONFIGS[slug];
  if (!config) return null;

  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden text-white border-b border-neutral-900"
      aria-label={`Craftsmanship showcase for ${config.title}`}
    >
      {/* Ambient Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        >
          <source src={config.videoSrc} type="video/mp4" />
        </video>
        {/* Deep Atmospheric Contrast Scrim */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div
          className="absolute bottom-0 inset-x-0 h-72 sm:h-96 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-10">
        <div className="text-left max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFAA4F] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" aria-hidden="true" />
            <span>{config.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading leading-tight drop-shadow-md">
            {config.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-200 leading-relaxed font-normal drop-shadow-sm">
            {config.subtitle}
          </p>
        </div>

        {/* Luminous Liquid Glass Feature Container */}
        <div className="w-full bg-white/[0.14] backdrop-blur-3xl p-6 sm:p-10 rounded-3xl border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:via-white/[0.04] before:to-transparent before:pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {config.tradePoints.map((point, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-left shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-[#FFAA4F] flex-shrink-0" aria-hidden="true" />
                    <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-snug drop-shadow-xs">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal drop-shadow-2xs">
                    {point.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/15 flex items-center text-[11px] font-bold text-[#FFAA4F] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  ST Standard Specification
                </div>
              </div>
            ))}
          </div>

          {/* Action Pathways inside the Glass Container */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Directly overseen by our senior principal building team</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                href={config.primaryCtaHref}
                variant="primary"
                size="md"
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-6 py-2.5 text-xs sm:text-sm shadow-lg border border-[#E69335] justify-center"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                {config.primaryCtaText}
              </Button>
              <Button
                href={config.secondaryCtaHref}
                variant="outline"
                size="md"
                className="text-white bg-slate-950/60 backdrop-blur-md border-white/60 hover:bg-slate-900/90 font-semibold px-6 py-2.5 text-xs sm:text-sm justify-center"
                leftIcon={<Calculator className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />}
              >
                {config.secondaryCtaText}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
