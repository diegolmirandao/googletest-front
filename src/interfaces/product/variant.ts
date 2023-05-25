import { IProductSubcategory } from "./subcategory";
import { IVariantOption } from "./variantOption";

export interface IVariant {
    id: number;
    name: string;
    has_amount_equivalencies: boolean;
    created_at: string;
    updated_at: string;
    subcategories: IProductSubcategory[];
    options: IVariantOption[];
}