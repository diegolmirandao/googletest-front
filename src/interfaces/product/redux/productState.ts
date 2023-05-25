import { MProductDetail } from 'src/models/product/detail';
import { MProductDetailCost } from 'src/models/product/detailCost';
import { MProductDetailPrice } from 'src/models/product/detailPrice';
import { MProduct } from 'src/models/product/product';

export interface IProductState {
  products: MProduct[];
  filteredProducts: MProduct[] | null;
  cursor: string | null;
  filteredCursor: string | null;
  productDetails: MProductDetail[];
  currentProduct: MProduct | undefined;
  currentProductDetail: MProductDetail | undefined;
  currentProductDetailPrice: MProductDetailPrice | undefined;
  currentProductDetailCost: MProductDetailCost | undefined;
};