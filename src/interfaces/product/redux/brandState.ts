import { MBrand } from 'src/models/product/brand';

export interface IBrandState {
  brands: MBrand[];
  currentBrand: MBrand | undefined;
};