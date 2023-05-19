import { IRegion } from "./region";

export interface ICountry {
    id: number;
    code: string;
    name: string;
    regions?: IRegion[];
    created_at: string;
    updated_at: string;
}