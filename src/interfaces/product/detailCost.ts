import { ICurrency } from "../currency/currency";
import { IProductCostType } from "./costType";

export interface IProductDetailCost {
    id: number;
    product_detail_id: number;
    cost_type_id: number;
    amount: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    type: IProductCostType;
    currency: ICurrency;
}