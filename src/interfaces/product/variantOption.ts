export interface IVariantOption {
    id: number;
    variant_id: number;
    name: string;
    equivalent_variant_option_id: number | null;
    equivalent_amount: number | null;
    created_at: string;
    updated_at: string;
    equivalent_option: IVariantOptionEquivalent | null;
}

export interface IVariantOptionEquivalent {
    id: number;
    variant_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}