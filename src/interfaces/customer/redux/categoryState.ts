import { MCustomerCategory } from 'src/models/customer/category';

export interface ICustomerCategoryState {
  customerCategories: MCustomerCategory[];
  currentCustomerCategory: MCustomerCategory | undefined;
};