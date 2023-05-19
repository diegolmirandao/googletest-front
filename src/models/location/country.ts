import { ICountry } from "src/interfaces/location/country";
import { MRegion } from "./region";

export class MCountry {
    public id: number;
    public code: string;
    public name: string;
    public regions: MRegion[];
    public createdAt: string;
    public updatedAt: string;

    constructor(country: ICountry) {
        this.id = country.id;
        this.code = country.code;
        this.name = country.name;
        this.regions = country.regions ? country.regions.map((region) => new MRegion(region)) : [];
        this.createdAt = country.created_at;
        this.updatedAt = country.updated_at;
    };
};