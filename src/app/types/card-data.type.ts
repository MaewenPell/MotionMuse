import { APP_COLORS } from 'src/styles/_colorVariables';

export type CardDataType = {
  type: 'resume' | 'evolution';
  color: APP_COLORS;
  title: string;
  value: number | string;
  evolutionType: 'up' | 'down' | 'equal';
  evolutionValue: number | string;
  evolutionSentence: string;
  unit: string; // TOOD union de type sur les valeurs possibles
};
