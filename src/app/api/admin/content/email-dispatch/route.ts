import { NextRequest, NextResponse } from 'next/server';
import { sendContentReportEmail, ContentReportPayload } from '@/lib/email/content-reporter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Default Monday/Wednesday pack if no specific body provided
    const payload: ContentReportPayload = {
      recipientEmail: body.recipientEmail || process.env.NOTIFICATION_EMAIL || 'enquiries@stcontractors.co.uk',
      topic: body.topic || 'Victorian Wraparound Extension Costs & Structural Feasibility in London (2026)',
      targetKeyword: body.targetKeyword || 'victorian wraparound extension cost london',
      targetJobValue: body.targetJobValue || '£120,000 – £220,000',
      seoArticle: {
        title: 'Victorian Wraparound Extension Costs & Structural Feasibility in London (2026 Guide)',
        slug: 'wraparound-extension-cost',
        summary: 'Comprehensive cost benchmarks, 3-steel goalpost frame engineering rules, and Thames Water build-over requirements for London homeowners.',
        fullMarkdown: '...',
      },
      royaltyFreeAssets: [
        {
          type: '🎥 Video B-Roll (Hook)',
          description: 'POV sledgehammer demolishing internal partition wall',
          license: 'Free Commercial Use (Pexels / CC0)',
          url: 'https://www.pexels.com/search/videos/demolition%20wall/',
        },
        {
          type: '🎥 Video B-Roll (Steelwork)',
          description: 'Steel RSJ beam installation & laser leveling by contractor',
          license: 'Free Commercial Use (Pexels)',
          url: 'https://www.pexels.com/search/videos/construction%20steel%20worker/',
        },
        {
          type: '🎥 UGC Walkthrough',
          description: 'Casual phone POV walking into sunny open-plan kitchen with sliding glass',
          license: 'Free Commercial Use (Pixabay)',
          url: 'https://pixabay.com/videos/search/modern%20kitchen/',
        },
        {
          type: '📸 High-Res Photo',
          description: 'Frameless architectural glass rear extension at twilight',
          license: 'Free Commercial Use (Unsplash)',
          url: 'https://unsplash.com/s/photos/modern-house-extension',
        },
      ],
      videos: [
        {
          title: '10s Budget & Cost Hook Reel',
          duration: '10s',
          angle: 'Transparent London Cost Curiosity',
          footageDirection: 'Whip-pan of dark Victorian alleyway cutting to finished 45m² sunlit open-plan kitchen.',
          onScreenText: 'Thinking of building a London wraparound extension in 2026? ⚠️ Here is what 45m² with steel & glass actually costs...',
          spokenScript: 'Thinking of building a wraparound extension in London this year? Here is what structural steel, glazing, and finishes actually cost in 2026.',
          cta: 'Calculate your exact project cost in 60 seconds at stcontractors.co.uk (Link in Bio).',
        },
        {
          title: '10s Before & After Shock Reel',
          duration: '10s',
          angle: 'Visual Lifestyle Upgrade',
          footageDirection: 'Sledgehammer breaking brickwork match-cutting to a massive frameless glass pavilion.',
          onScreenText: 'From cramped Victorian box... to open-plan architectural glass living ☀️',
          spokenScript: 'From dark Victorian galley kitchen to open-plan architectural living filled with natural light.',
          cta: 'Test your dimensions and budget free at stcontractors.co.uk.',
        },
        {
          title: '30s Structural Builder Secret (Authority)',
          duration: '30s',
          angle: 'Structural Engineering & Hidden Costs',
          footageDirection: 'Builder on-site pointing at exposed corner brickwork, then close-up of goalpost steel frame.',
          onScreenText: 'The £15,000 mistake London builders make on wraparound extensions. London Clay + 3-Steel Goalpost System ⚠️',
          spokenScript: 'When you combine a side return and rear extension, you remove the corner of your house. Cheap quotes rely on single drop beams that sag. You actually need an interconnected 3-steel goalpost frame bearing on engineered concrete padstones. On our projects, we recess the steel into the ceiling joists for clean flush ceilings and full Building Control sign-off.',
          cta: 'Plan your project and book a surveyor visit at stcontractors.co.uk.',
        },
        {
          title: '30s Architectural Decision Masterclass (Trade-Off)',
          duration: '30s',
          angle: 'Glazing Choices & Cost Comparison',
          footageDirection: 'Montage of Bi-folds vs Minimalist Sliders vs Black Steel Crittall doors.',
          onScreenText: 'Bi-folds vs Minimalist Sliders vs Crittall: Which belongs in your London extension? Frameless Glass: +£350/m² | Crittall: +£420/m²',
          spokenScript: 'Bi-folds give you a 100% open aperture, but have thicker frame profiles. Minimalist sliding doors have 20mm sightlines, giving you uninterrupted garden views all year round. Frameless structural glass adds roughly £350 per square metre, while authentic steel Crittall adds around £420 per square metre.',
          cta: 'Test live glazing options on our interactive architectural studio at stcontractors.co.uk.',
        },
      ],
      carousel: {
        title: 'Planning a London Wraparound Extension in 2026?',
        slides: [
          {
            slideNumber: 1,
            type: 'The Curiosity Hook',
            visualDirection: 'Ultra-clean dark architectural image of London extension with amber badge.',
            copy: 'Planning a London Wraparound Extension in 2026? 🏡\nSwipe to see the real costs, structural steel requirements, and the 3 things builders leave out of their quotes ➔',
          },
          {
            slideNumber: 2,
            type: 'The Hidden Trap',
            visualDirection: 'Photo of exposed brickwork and underground drainage manhole with red warning badge.',
            copy: 'Trap #1: Thames Water & Groundworks ⚠️\nIf you build within 3 metres of a public sewer, you legally require a formal Thames Water Build-Over Agreement and CCTV survey. Budget £1,500–£3,500 for inspection chamber relocations.',
          },
          {
            slideNumber: 3,
            type: 'Structural Engineering',
            visualDirection: '3D CAD schematic of interconnected Universal Column (UC) steel beams.',
            copy: 'Why You Need a 3-Steel Goalpost Frame 📐\nRemoving the rear wall and side outrigger removes the corner load-bearing point of your home. An interconnected 3-steel frame prevents upper-floor ceiling cracks and allows flat, flush ceilings.',
          },
          {
            slideNumber: 4,
            type: '2026 Cost Breakdown',
            visualDirection: '2-column pricing comparison card.',
            copy: '2026 London Wraparound Cost Matrix 💷\n• 35m² Standard Spec: £105k – £130k\n• 45m² Architectural Spec: £145k – £185k\n• 60m² Luxury Spec: £195k – £245k\n(Includes groundwork, steel, glazing, MEP & 10% contingency)',
          },
          {
            slideNumber: 5,
            type: 'Homeowner Checklist',
            visualDirection: 'Green tick checklist card.',
            copy: 'Before You Sign With Any Builder: ✅\n✔ Verified £10M Public Liability Insurance\n✔ Party Wall Notices served 2 months early\n✔ Milestone stage payments tied to progress\n✔ 10-Year Insurance Backed Guarantee',
          },
          {
            slideNumber: 6,
            type: 'Action Call-to-Action',
            visualDirection: 'Mockup of ST CONTRACTORS Project Studio with direct website arrow.',
            copy: 'Ready to calculate your exact project? 📲\nUse our free 60-second Architectural Feasibility Studio at stcontractors.co.uk.\n(Link in Bio to plan your project & book a free surveyor site visit)',
          },
        ],
      },
      socialCaptions: {
        instagramAndTiktok: `Planning to combine a side return and rear extension on your London home in 2026? 🏡🔨\n\nHere are 3 critical realities to check before signing any builder's quote:\n1️⃣ Structural Steel: You need an interconnected 3-steel goalpost frame to support the upper brickwork floors without intermediate columns.\n2️⃣ Thames Water: If building within 3m of a public sewer, secure your build-over agreement and CCTV drainage survey early.\n3️⃣ Flush Ceilings: Ensure your structural engineer recesses the RSJs into the joist space so you don't get ugly ceiling drop beams.\n\nWant an accurate, transparent cost breakdown for your exact dimensions?\n👉 Head to the link in our bio to use our free 60-second Architectural Feasibility Studio: stcontractors.co.uk`,
        linkedin: `For London homeowners with Victorian or Edwardian properties, ground-floor wraparound extensions represent the single highest value-add residential transformation.\n\nAt ST CONTRACTORS, we provide complete turnkey design-and-build management from initial structural engineering to final completion.\n\nTest your project dimensions and review live 2026 London cost benchmarks with our interactive planning studio: https://stcontractors.co.uk/visualiser`,
        hashtags: [
          '#LondonRenovation',
          '#WraparoundExtension',
          '#HouseExtensionLondon',
          '#VictorianTerrace',
          '#KitchenKnockthrough',
          '#Chiswick',
          '#Richmond',
          '#Ealing',
          '#LondonBuilder',
          '#HomeRenovationUK',
        ],
      },
    };

    const result = await sendContentReportEmail(payload);

    return NextResponse.json({
      success: result.success,
      recipient: payload.recipientEmail,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
