import { IVariant } from "src/interfaces/product/variant";
import { MProductSubcategory } from "./subcategory";
import { MVariantOption } from "./variantOption";

export class MVariant {
    public id: number;
    public name: string;
    public hasAmountEquivalencies: boolean;
    public createdAt: string;
    public updatedAt: string;
    public subcategories: MProductSubcategory[];
    public options: MVariantOption[];

    constructor(variant: IVariant) {
        this.id = variant.id;
        this.name = variant.name;
        this.hasAmountEquivalencies = variant.has_amount_equivalencies;
        this.createdAt = variant.created_at;
        this.updatedAt = variant.updated_at;
        this.subcategories = variant.subcategories.map(subcategory => new MProductSubcategory(subcategory));
        this.options = variant.options.map(option => new MVariantOption(option));
    };
};