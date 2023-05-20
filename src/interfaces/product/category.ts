import { IProductSubcategory } from "./subcategory";

export interface IProductCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    subcategories: IProductSubcategory[];
}