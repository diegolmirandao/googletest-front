import { IVariantOption } from "./variantOption";

export interface IProductDetailVariant {
    id: number;
    product_detail_id: number;
    variant_option_id: number;
    name: string;
    created_at: string;
    updated_at: string;
    option: IVariantOption;
}