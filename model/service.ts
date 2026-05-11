export type Service = {
  title: string;
  description: string;
  tier?: 'priority' | 'secondary';
};

export const EXAMPLE_SERVICES: Service[] = [
  {
    title: 'Kitchen Remodels',
    description: 'Full kitchen renovations from design through finish — custom cabinetry, countertops, tile, and appliance installation.',
    tier: 'priority',
  },
  {
    title: 'Bathroom Renovations',
    description: 'Transform your bathroom with modern fixtures, walk-in showers, soaking tubs, and professional tilework.',
  },
  {
    title: 'Flooring Installation',
    description: 'Hardwood, LVP, tile, and carpet — we supply and install. Subfloor repair and leveling included.',
  },
  {
    title: 'Deck & Patio',
    description: 'Custom outdoor living spaces in composite or pressure-treated lumber, including pergolas and built-in seating.',
  },
  {
    title: 'Basement Finishing',
    description: 'Convert unfinished square footage into livable space — media rooms, offices, guest suites, and more.',
  },
  {
    title: 'Interior Painting',
    description: 'Professional painting with careful prep, clean lines, and a durable finish. Low-VOC options available.',
  },
];
