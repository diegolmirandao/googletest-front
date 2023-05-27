import { IAddUpdateVariantOption } from "./addUpdateVariantOption";

export interface IAddVariant {
    name: string;
    has_amount_equivalencies: boolean;
    subcategories: number[];
    options: IAddUpdateVariantOption[];
};