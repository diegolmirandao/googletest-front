import { IWarehouse } from "../warehouse/warehouse";

export interface IProductDetailStock {
    id: number;
    product_detail_id: number;
    warehouse_id: number;
    stock: number;
    created_at: string;
    updated_at: string;
    warehouse: IWarehouse;
}