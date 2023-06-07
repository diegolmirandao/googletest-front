import { IAddSaleOrderProduct } from "./addProduct";
import { Dayjs } from "dayjs";

export interface IAddSaleOrder {
    customer_id: number;
    currency_id: number;
    establishment_id: number;
    point_of_sale_id: number;
    warehouse_id: number;
    seller_id: number;
    ordered_at: Dayjs | null;
    expires_at: Dayjs | null;
    comments: string;
    products: IAddSaleOrderProduct[];
};