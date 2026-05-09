import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPortfolio } from '../../model/notion';
import type { PortfolioItem } from '../../model/portfolio-item';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<PortfolioItem[]>) {
  const items = await fetchPortfolio();
  res.status(200).json(items);
}
