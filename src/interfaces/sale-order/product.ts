import { IProductDetail } from "../product/detail";
import { IProductDetailPrice } from "../product/detailPrice";
import { IMeasurementUnit } from "../product/measurementUnit";
import { ISaleOrderStatus } from "./status";

export interface ISaleOrderProduct {
    id: number;
    sale_order_id: number;
    product_detail_price_id: number;
    measurement_unit_id: number;
    status_id: number;
    quantity: number;
    billed_quantity: number;
    canceled_quantity: number;
    discount: number;
    code: string;
    name: string;
    taxed: boolean;
    tax: number;
    percentage_taxed: number;
    comments: string;
    created_at: string;
    updated_at: string;
    product_detail: IProductDetail;
    measurement_unit: IMeasurementUnit;
    price: IProductDetailPrice;
    status: ISaleOrderStatus;
};