import { IAddUpdateProductSubcategory } from "./addUpdateSubcategory";

export interface IAddProductCategory {
    name: string;
    subcategories: IAddUpdateProductSubcategory[];
};