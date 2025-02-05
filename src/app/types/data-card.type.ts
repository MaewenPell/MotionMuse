
import { APP_COLORS } from 'src/styles/_colorVariables';
import { Icons } from './icons';
import { UnitSource } from './unit-source';
import { PrimeIcons } from "primeng/api";

export type CardDataInformations = {
  title: string;
  mainValue: number;
  icon: Icons;
  isPrimeIcon: boolean;
  mainValueUnit: UnitSource;
  evolutionValue?: number;
  evolutionColor: APP_COLORS;
  evolutionIcon: PrimeIcons;
  evolutionUnit?: UnitSource;
  evolutionSentence?: string;
  color: APP_COLORS;
};
