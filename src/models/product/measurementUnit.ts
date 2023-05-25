import { IMeasurementUnit } from "src/interfaces/product/measurementUnit";

export class MMeasurementUnit {
    public id: number;
    public name: string;
    public abbreviation: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(measurementUnit: IMeasurementUnit) {
        this.id = measurementUnit.id;
        this.name = measurementUnit.name;
        this.abbreviation = measurementUnit.abbreviation;
        this.createdAt = measurementUnit.created_at;
        this.updatedAt = measurementUnit.updated_at;
    };
};