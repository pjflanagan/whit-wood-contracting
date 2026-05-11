export type PageSection = {
  id: string;
  title: string;
  description: string;
};

export const DEFAULT_SECTIONS: PageSection[] = [
  { id: 'services', title: 'Our Services', description: '' },
  { id: 'contact', title: 'Get in Touch', description: '' },
  { id: 'portfolio', title: 'Our Work', description: '' },
  { id: 'testimonials', title: 'What Our Clients Say', description: '' },
  { id: 'about', title: 'About Us', description: '' },
];
