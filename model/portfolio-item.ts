import portfolioJson from '../content/portfolio.json';

export type PortfolioItem = {
  title: string;
  type: string;
  description: string;
  photos: string[];
};

export const LOCAL_PORTFOLIO: PortfolioItem[] = portfolioJson.portfolio;
