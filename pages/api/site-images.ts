import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchSiteImages } from '../../services/api';
import type { SiteImages } from '../../model/site-images';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<SiteImages>) {
  const siteImages = await fetchSiteImages();
  res.setHeader('Cache-Control', 'public, s-maxage=1800');
  res.status(200).json(siteImages);
}
