export type ServingInfoDtoType = {
  servingSizeQuantity: number | null;
  servingSizeUnit: string | null;
  servingSizeMetricQuantity: number;
  servingSizeMetricUnit: 'g' | 'mL';
  density: number | null;
};
