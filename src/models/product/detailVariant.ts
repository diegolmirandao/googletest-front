import { IProductDetailVariant } from "src/interfaces/product/detailVariant";
import { MVariantOption } from "./variantOption";

export class MProductDetailVariant {
    public id: number;
    public productDetailId: number;
    public variantoptionId: number;
    public createdAt: string;
    public updatedAt: string;
    public option: MVariantOption;

    constructor(detailVariant: IProductDetailVariant) {
        this.id = detailVariant.id;
        this.productDetailId = detailVariant.product_detail_id;
        this.variantoptionId = detailVariant.variant_option_id;
        this.createdAt = detailVariant.created_at;
        this.updatedAt = detailVariant.updated_at;
        this.option = new MVariantOption(detailVariant.option);
    };
};