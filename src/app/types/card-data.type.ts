export type CardDataType = {
  type: 'resume' | 'evolution';
  color: string;
  title: string;
  value: number | string;
  iconRef: string; // Todo enum
  arrowType: 'up' | 'down' | 'equal';
  evolutionValue: number | string;
  evolutionSentece: string;
};
