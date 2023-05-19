import { MCity } from "./city";
import { IRegion } from "src/interfaces/location/region";

export class MRegion {
    public id: number;
    public countryId: number;
    public code: string;
    public name: string;
    public cities: MCity[];
    public createdAt: string;
    public updatedAt: string;

    constructor(region: IRegion) {
        this.id = region.id;
        this.countryId = region.country_id;
        this.code = region.code;
        this.name = region.name;
        this.cities = region.cities ? region.cities.map((city) => new MCity(city)) : [];
        this.createdAt = region.created_at;
        this.updatedAt = region.updated_at;
    };
};