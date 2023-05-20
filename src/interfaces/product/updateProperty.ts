import { PropertyTypeType } from "src/types/propertyTypeType";

export interface IUpdateProperty {
    name: string;
    type: PropertyTypeType;
    measurement_unit_id: number | string;
    has_multiple_values: boolean;
    is_required: boolean;
    subcategories: number[];
};