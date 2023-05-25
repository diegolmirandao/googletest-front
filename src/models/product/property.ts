import { IProperty } from "src/interfaces/product/property";
import { PropertyTypeType } from "src/types/propertyTypeType";
import { MMeasurementUnit } from "./measurementUnit";
import { MPropertyOption } from "./propertyOption";
import { MProductSubcategory } from "./subcategory";

export class MProperty {
    public id: number;
    public measurementUnitId: number | null;
    public name: string;
    public type: PropertyTypeType;
    public hasMultipleValues: boolean;
    public isRequired: boolean;
    public createdAt: string;
    public updatedAt: string;
    public measurementUnit: MMeasurementUnit | null;
    public subcategories: MProductSubcategory[];
    public options: MPropertyOption[];

    constructor(property: IProperty) {
        this.id = property.id;
        this.measurementUnitId = property.measurement_unit_id;
        this.name = property.name;
        this.type = property.type;
        this.hasMultipleValues = property.has_multiple_values;
        this.isRequired = property.is_required;
        this.createdAt = property.created_at;
        this.updatedAt = property.updated_at;
        this.measurementUnit = property.measurement_unit ? new MMeasurementUnit(property.measurement_unit!) : null;
        this.subcategories = property.subcategories.map(subcategory => new MProductSubcategory(subcategory));
        this.options = property.options.map(option => new MPropertyOption(option));
    };
};