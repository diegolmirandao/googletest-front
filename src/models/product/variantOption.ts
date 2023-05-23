import { IVariantOption, IVariantOptionEquivalent } from "src/interfaces/product/variantOption";

export class MVariantOption {
    public id: number;
    public variantId: number;
    public name: string;
    public equivalentVariantOptionId: number | null;
    public equivalentAmount: number | null;
    public createdAt: string;
    public updatedAt: string;
    public equivalentOption: MVariantOptionEquivalent | null;

    constructor(option: IVariantOption) {
        this.id = option.id;
        this.variantId = option.variant_id;
        this.name = option.name;
        this.equivalentVariantOptionId = option.equivalent_variant_option_id;
        this.equivalentAmount = option.equivalent_amount;
        this.createdAt = option.created_at;
        this.updatedAt = option.updated_at;
        this.equivalentOption = option.equivalent_option ? new MVariantOptionEquivalent(option.equivalent_option) : null;
    };
};

export class MVariantOptionEquivalent {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(option: IVariantOptionEquivalent) {
        this.id = option.id;
        this.name = option.name;
        this.createdAt = option.created_at;
        this.updatedAt = option.updated_at;
    };
};