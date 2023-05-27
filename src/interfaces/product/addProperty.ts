import { PropertyTypeType } from "src/types/propertyTypeType";
import { IAddUpdatePropertyOption } from "./addUpdatePropertyOption";

export interface IAddProperty {
    name: string;
    type: PropertyTypeType;
    measurement_unit_id: number | string;
    has_multiple_values: boolean;
    is_required: boolean;
    subcategories: number[];
    options: IAddUpdatePropertyOption[];
};