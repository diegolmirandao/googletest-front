import { IBusiness } from "../business/business";
import { IPointOfSale } from "./pointOfSale";

export interface IEstablishment {
    id: number;
    business_id: number;
    name: string;
    created_at: string;
    updated_at: string;
    business: IBusiness;
    points_of_sale: IPointOfSale[];
};