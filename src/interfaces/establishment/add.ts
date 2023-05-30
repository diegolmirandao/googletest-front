import { IAddUpdatePointOfSale } from "./addUpdatePointOfSale";

export interface IAddEstablishment {
    business_id: number;
    name: string;
    points_of_sale: IAddUpdatePointOfSale[];
};