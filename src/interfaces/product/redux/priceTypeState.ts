import { MProductPriceType } from 'src/models/product/priceType';

export interface IProductPriceTypeState {
  productPriceTypes: MProductPriceType[];
  currentProductPriceType: MProductPriceType | undefined;
};