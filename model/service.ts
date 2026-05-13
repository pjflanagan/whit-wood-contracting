import servicesJson from '../content/services.json';

export type Service = {
  title: string;
  description: string;
  images?: string[];
};

export const LOCAL_SERVICES: Service[] = servicesJson.services;
