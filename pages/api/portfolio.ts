import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPortfolio } from '../../services/api';
import type { PortfolioItem } from '../../model/portfolio-item';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<PortfolioItem[]>) {
  const items = await fetchPortfolio();
  res.setHeader('Cache-Control', 'public, s-maxage=1800');
  res.status(200).json(items);
}
