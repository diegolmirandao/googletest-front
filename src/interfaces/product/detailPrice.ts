import { ICurrency } from "../currency/currency";
import { IProductPriceType } from "./priceType";

export interface IProductDetailPrice {
    id: number;
    product_detail_id: number;
    price_type_id: number;
    amount: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    type: IProductPriceType;
    currency: ICurrency;
}