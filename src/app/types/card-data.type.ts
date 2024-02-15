import { APP_COLORS } from 'src/styles/_colorVariables';
import { UnitSource } from './unit-source';

export type CardDataType = {
  type: 'resume' | 'evolution';
  color: APP_COLORS;
  title: string;
  value: number;
  evolutionType: 'up' | 'down' | 'equal';
  evolutionValue: number;
  evolutionSentence: string;
  unit: UnitSource;
};
