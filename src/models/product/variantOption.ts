import { IVariantOption } from "src/interfaces/product/variantOption";

export class MVariantOption {
    public id: number;
    public name: string;
    public equivalentVariantOptionId: number | null;
    public equivalentAmount: number | null;
    public createdAt: string;
    public updatedAt: string;
    public equivalentOption: MVariantOption | null;

    constructor(option: IVariantOption) {
        this.id = option.id;
        this.name = option.name;
        this.equivalentVariantOptionId = option.equivalent_variant_option_id;
        this.equivalentAmount = option.equivalent_amount;
        this.createdAt = option.created_at;
        this.updatedAt = option.updated_at;
        this.equivalentOption = option.equivalent_option ? new MVariantOption(option.equivalent_option) : null;
    };
};