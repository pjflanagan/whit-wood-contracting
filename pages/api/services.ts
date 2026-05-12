import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchServices } from '../../services/api';
import type { Service } from '../../model/service';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<Service[]>) {
  const services = await fetchServices();
  res.setHeader('Cache-Control', 'public, s-maxage=1800');
  res.status(200).json(services);
}
