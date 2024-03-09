import { Icons } from './icons';

export type CardDataInformations = {
  title: string;
  mainValue: number;
  icon: Icons;
  mainValueUnit: 'm' | 'km';
  evolutionValue: number;
  evolutionUnit: 'm' | 'km';
  evolutionSentence: string;
};
