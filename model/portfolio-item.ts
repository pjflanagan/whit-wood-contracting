export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
};

export const EXAMPLE_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'Hillside Kitchen Overhaul',
    category: 'Kitchen',
    description: 'Removed a load-bearing wall to open the kitchen to the living space. Custom walnut cabinetry, quartz countertops, and a tiled backsplash.',
    imageUrl: '',
  },
  {
    id: '2',
    title: 'Master Bath Transformation',
    category: 'Bathroom',
    description: 'Converted a dated tub-shower combo into a frameless glass walk-in shower with heated floors and a freestanding soaking tub.',
    imageUrl: '',
  },
  {
    id: '3',
    title: 'Open-Concept LVP Flooring',
    category: 'Flooring',
    description: 'Replaced carpet throughout a 1,800 sq ft main floor with wide-plank luxury vinyl plank, including custom transitions and stair nose.',
    imageUrl: '',
  },
  {
    id: '4',
    title: 'Wraparound Deck Build',
    category: 'Deck',
    description: '680 sq ft wraparound deck in Trex composite with built-in bench seating, a pergola, and cable rail. Permit-pulled and inspected.',
    imageUrl: '',
  },
  {
    id: '5',
    title: 'Basement Media Room',
    category: 'Basement',
    description: 'Finished a 900 sq ft unfinished basement with a home theater nook, wet bar rough-in, and a full bathroom.',
    imageUrl: '',
  },
  {
    id: '6',
    title: 'Whole-Home Interior Repaint',
    category: 'Painting',
    description: 'Full interior repaint of a 2,400 sq ft home — ceilings, walls, trim, and doors. Low-VOC Sherwin-Williams throughout.',
    imageUrl: '',
  },
];
