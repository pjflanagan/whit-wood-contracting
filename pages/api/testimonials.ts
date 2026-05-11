import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTestimonials } from '../../services/api';
import type { Testimonial } from '../../model/testimonial';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<Testimonial[]>) {
  const testimonials = await fetchTestimonials();
  res.status(200).json(testimonials);
}
