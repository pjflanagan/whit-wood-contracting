export type Service = {
  title: string;
  description: string;
  tier?: 'primary' | 'secondary' | 'tertiary';
  images?: string[];
};

export const DEFAULT_SERVICES: Service[] = [];
