import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchServices } from '../../model/notion';
import type { Service } from '../../model/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Service[]>) {
  const services = await fetchServices();
  res.status(200).json(services);
}
