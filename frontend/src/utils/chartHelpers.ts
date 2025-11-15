export const formatPieLabelContent = (datum: Record<string, any>): string => {
  const label =
    datum?.name ??
    datum?.category ??
    datum?.status ??
    datum?.type ??
    datum?.label ??
    'Total';

  const percentValue = typeof datum?.percent === 'number'
    ? datum.percent
    : typeof datum?.percentage === 'number'
      ? datum.percentage
      : 0;

  const normalized = Math.max(0, Math.min(1, percentValue));
  return `${label} ${(normalized * 100).toFixed(1)}%`;
};

