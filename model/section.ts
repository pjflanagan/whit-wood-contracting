import sectionsJson from '../content/sections.json';

export type PageSection = {
  id: string;
  title: string;
  description: string;
};

export const LOCAL_SECTIONS: PageSection[] = sectionsJson.sections;
