import { IZone } from "./zone";

export interface ICity {
    id: number;
    region_id: number;
    code: string;
    name: string;
    zones?: IZone[];
    created_at: string;
    updated_at: string;
}