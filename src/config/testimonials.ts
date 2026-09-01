export interface Testimonial {
  id: string;
  name: string;
  location: string;
  projectType: string;
  rating: number;
  date: string;
  source: 'Trustpilot' | 'Google Reviews' | 'Verified Client';
  quote: string;
  highlight: string;
  budgetDelivered: string;
  duration: string;
  avatarUrl: string;
  projectImageUrl?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 'richmond-full-renovation',
    name: 'Dr. Alistair & Clare Henderson',
    location: 'Richmond, South West London',
    projectType: 'Full Period Home Renovation & Rear Extension',
    rating: 5,
    date: 'February 2026',
    source: 'Trustpilot',
    highlight: 'Completed on budget with zero hidden extras.',
    quote:
      'We had heard endless horror stories about builders in London, but ST CONTRACTORS completely changed our perception. From the initial fixed-price itemized quote to handover, their communication was exceptional. Having a dedicated project director on-site every morning gave us complete peace of mind.',
    budgetDelivered: '£215,000 (Exact Contract Price)',
    duration: '18 Weeks',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    projectImageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chiswick-kitchen-knockthrough',
    name: 'Mark & Sarah Thornton',
    location: 'Chiswick, West London',
    projectType: 'Bespoke Kitchen & Structural Knockthrough',
    rating: 5,
    date: 'January 2026',
    source: 'Google Reviews',
    highlight: 'Turnaround in 12 weeks exactly as promised.',
    quote:
      'The structural team installed 3 heavy RSJ steel beams in our Victorian terrace and opened up the whole ground floor into an incredible garden kitchen. Clean, respectful master tradesmen who tidied up every single evening.',
    budgetDelivered: '£85,000 (Milestone Payments)',
    duration: '12 Weeks',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    projectImageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ealing-rear-extension',
    name: 'Jonathan Reynolds',
    location: 'Ealing, West London',
    projectType: 'Wraparound Extension & Crittall Glazing',
    rating: 5,
    date: 'December 2025',
    source: 'Trustpilot',
    highlight: 'Unrivalled architectural quality and joinery.',
    quote:
      'ST CONTRACTORS managed all council planning submissions, Thames Water build-over agreements, and building control inspections seamlessly. The final space has transformed how our family lives every day.',
    budgetDelivered: '£132,000 (Fixed Schedule)',
    duration: '14 Weeks',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    projectImageUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wimbledon-loft-conversion',
    name: 'Elena Rostova',
    location: 'Wimbledon, South West London',
    projectType: 'Master Suite Mansard Loft Conversion',
    rating: 5,
    date: 'November 2025',
    source: 'Google Reviews',
    highlight: 'Flawless building control sign-off.',
    quote:
      'Added a full master bedroom suite, walk-in dressing room, and micro-cement bathroom. The soundproofing and thermal insulation are top tier. Could not recommend ST CONTRACTORS more highly.',
    budgetDelivered: '£78,000 (Guaranteed Price)',
    duration: '9 Weeks',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    projectImageUrl:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  },
];
