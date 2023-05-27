import { MPropertyOption } from "./propertyOption";
import { IProductProperty } from "src/interfaces/product/productProperty";

export class MProductProperty {
    public propertyId: number;
    public name: string;
    public value: string | string[];

    constructor(property: IProductProperty) {
        this.propertyId = property.property_id;
        this.name = property.name;
        this.value = property.value;
    };
};