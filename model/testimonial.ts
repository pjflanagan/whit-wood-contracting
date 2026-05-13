import testimonialsJson from '../content/testimonials.json';

export type Testimonial = {
  clientName: string;
  quote: string;
  rating: number;
};

export const LOCAL_TESTIMONIALS: Testimonial[] = testimonialsJson.testimonials;
