import { PropertyTypeType } from "src/types/propertyTypeType";
import { IMeasurementUnit } from "./measurementUnit";
import { IPropertyOption } from "./propertyOptions";
import { IProductSubcategory } from "./subcategory";

export interface IProperty {
    id: number;
    measurement_unit_id: number | null;
    name: string;
    type: PropertyTypeType;
    has_multiple_values: boolean;
    is_required: boolean;
    created_at: string;
    updated_at: string;
    measurement_unit: IMeasurementUnit | null;
    subcategories: IProductSubcategory[];
    options: IPropertyOption[];
}