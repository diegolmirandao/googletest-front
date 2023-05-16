import { IZone } from "src/interfaces/location/zone";

export class MZone {
    public id: number;
    public cityId: number;
    public code: string;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(zone: IZone) {
        this.id = zone.id;
        this.cityId = zone.city_id;
        this.code = zone.code;
        this.name = zone.name;
        this.createdAt = zone.created_at;
        this.updatedAt = zone.updated_at;
    };
};