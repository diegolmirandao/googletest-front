import { IImage } from "../image/image";
import { IDescription } from "./description";

export interface IUpdateProduct {
    category_id: number;
    subcategory_id: number;
    brand_id: number;
    type_id: number;
    measurement_unit_id: number;
    codes: string[];
    name: string;
    description: string;
    status: boolean;
    taxed: boolean;
    tax: number;
    percentage_taxed: number;
}