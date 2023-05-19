import { ICity } from "./city";

export interface IRegion {
    id: number;
    country_id: number;
    code: string;
    name: string;
    cities?: ICity[];
    created_at: string;
    updated_at: string;
}