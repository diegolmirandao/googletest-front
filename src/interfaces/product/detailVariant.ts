import { IVariantOption } from "./variantOption";

export interface IProductDetailVariant {
    id: number;
    product_detail_id: number;
    variant_option_id: number;
    created_at: string;
    updated_at: string;
    option: IVariantOption;
}