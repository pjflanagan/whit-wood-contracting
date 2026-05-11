import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAbout, fetchContact } from '../../services/api';

const SECTIONS = ['about', 'contact'] as const;
export type SectionName = typeof SECTIONS[number];

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const section = req.query.section as SectionName;
  let content = '';
  if (section === 'about') content = await fetchAbout();
  else if (section === 'contact') content = await fetchContact();
  res.status(200).json(content);
}
