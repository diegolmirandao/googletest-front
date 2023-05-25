import { IPropertyOption } from "./propertyOptions";

export interface IProductProperty {
    property_id: number;
    name: string;
    value: string | string[];
}