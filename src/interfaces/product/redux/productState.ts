import { MProductDetail } from 'src/models/product/detail';
import { MProduct } from 'src/models/product/product';

export interface IProductState {
  products: MProduct[];
  productDetails: MProductDetail[];
  currentProduct: MProduct | undefined;
  currentProductDetail: MProductDetail | undefined;
};