export const siteConfig = {
  name: 'ST CONTRACTORS',
  shortName: 'ST Contractors',
  tagline: 'Plan it. Price it. Visualise it. Let us build it.',
  description:
    'London and South East premier residential construction specialists. We design, plan, and build luxury home extensions, full renovations, loft conversions, and architectural transformations.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stcontractors.co.uk',
  ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  company: {
    name: 'ST Contractors Ltd',
    registrationNumber: '12345678',
    vatNumber: 'GB 123 4567 89',
    phone: '020 8123 4567',
    email: 'enquiries@stcontractors.co.uk',
    address: '14 Enterprise Way, Chiswick Park, London, W4 5YB',
    openingHours: 'Monday – Friday: 8:00am – 6:00pm, Saturday: 9:00am – 1:00pm',
  },
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Resources', href: '/calculators' },
      { name: 'Portfolio', href: '/projects' },
      { name: 'Sign in', href: '/portal/login' },
    ],
    ctas: {
      primary: {
        text: 'Start Your Project',
        href: '/plan-my-project',
      },
      secondary: {
        text: 'Book Consultation',
        href: '/contact?type=consultation',
      },
    },
  },
  serviceAreas: [
    { name: 'Ealing', slug: 'ealing', region: 'West London' },
    { name: 'Richmond', slug: 'richmond', region: 'South West London' },
    { name: 'Harrow', slug: 'harrow', region: 'North West London' },
    { name: 'Chiswick', slug: 'chiswick', region: 'West London' },
    { name: 'Kew', slug: 'kew', region: 'South West London' },
    { name: 'Wimbledon', slug: 'wimbledon', region: 'South West London' },
    { name: 'Kingston', slug: 'kingston', region: 'Surrey / SW London' },
  ],
  trustStats: [
    { value: '15+', label: 'Years Experience' },
    { value: '250+', label: 'Delivered Projects' },
    { value: '100%', label: 'Dedicated Project Managers' },
    { value: '10-Year', label: 'Structural Warranty' },
  ],
  guarantees: [
    {
      title: 'Fixed Price Guarantee',
      description: 'Transparent milestone contracts with no hidden extras or unexpected surprises.',
    },
    {
      title: 'One Dedicated Team',
      description: 'Single point of contact from initial architectural planning to final decorator snagging.',
    },
    {
      title: '10-Year Structural Warranty',
      description: 'Comprehensive insurance-backed guarantees on all structural and structural envelope work.',
    },
    {
      title: 'Building Regulations Certified',
      description: 'Full compliance management with local authority sign-off and safety certificates.',
    },
  ],
};
