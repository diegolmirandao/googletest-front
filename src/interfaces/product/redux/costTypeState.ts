import { MProductCostType } from 'src/models/product/costType';

export interface IProductCostTypeState {
  productCostTypes: MProductCostType[];
  currentProductCostType: MProductCostType | undefined;
};