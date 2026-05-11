export type Testimonial = {
  id: string;
  clientName: string;
  projectType: string;
  quote: string;
  rating: number;
};

export const EXAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Sarah M.',
    projectType: 'Kitchen',
    quote: 'Ridge & Rail completely transformed our kitchen. The team was professional from day one — they showed up on time, kept the site clean, and finished two days ahead of schedule. The quality is exceptional.',
    rating: 5,
  },
  {
    id: '2',
    clientName: 'David & Karen T.',
    projectType: 'Deck',
    quote: "We wanted a deck we could actually use year-round. Jake's crew built exactly what we envisioned — beautiful composite decking, a pergola for shade, and cable rail that doesn't block the view. Couldn't be happier.",
    rating: 5,
  },
  {
    id: '3',
    clientName: 'Mike R.',
    projectType: 'Bathroom',
    quote: 'Our master bathroom looks like something out of a magazine now. They handled everything — demo, plumbing, tile, fixtures. No surprises on price, no cut corners. This is who you call.',
    rating: 5,
  },
  {
    id: '4',
    clientName: 'The Hendersons',
    projectType: 'Basement',
    quote: 'They turned our storage basement into an actual living space. The framing, drywall, flooring, and recessed lighting are all top-notch. Our kids basically live down there now.',
    rating: 5,
  },
];
