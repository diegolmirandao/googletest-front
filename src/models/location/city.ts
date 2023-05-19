import { ICity } from "src/interfaces/location/city";
import { ICountry } from "src/interfaces/location/country";
import { MZone } from "./zone";

export class MCity {
    public id: number;
    public regionId: number;
    public code: string;
    public name: string;
    public zones: MZone[];
    public createdAt: string;
    public updatedAt: string;

    constructor(city: ICity) {
        this.id = city.id;
        this.regionId = city.region_id;
        this.code = city.code;
        this.name = city.name;
        this.zones = city.zones ? city.zones.map((zone) => new MZone(zone)) : [];
        this.createdAt = city.created_at;
        this.updatedAt = city.updated_at;
    };
};