import { IProductDetail } from "../product/detail";
import { IProductDetailPrice } from "../product/detailPrice";
import { IMeasurementUnit } from "../product/measurementUnit";

export interface ISaleProduct {
    id: number;
    sale_id: number;
    product_detail_price_id: number;
    measurement_unit_id: number;
    quantity: number;
    discount: number;
    code: string;
    name: string;
    taxed: boolean;
    tax: number;
    percentage_taxed: number;
    created_at: string;
    updated_at: string;
    product_detail: IProductDetail;
    measurement_unit: IMeasurementUnit;
    price: IProductDetailPrice;
};