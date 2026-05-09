import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTestimonials } from '../../model/notion';
import type { Testimonial } from '../../model/testimonial';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<Testimonial[]>) {
  const testimonials = await fetchTestimonials();
  res.status(200).json(testimonials);
}
