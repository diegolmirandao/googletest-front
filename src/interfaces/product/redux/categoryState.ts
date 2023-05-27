import { MProductCategory } from 'src/models/product/category';
import { MProductSubcategory } from 'src/models/product/subcategory';

export interface IProductCategoryState {
  productCategories: MProductCategory[];
  currentProductCategory: MProductCategory | undefined;
  currentProductSubcategory: MProductSubcategory | undefined;
};