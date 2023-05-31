import { IProductDetail } from "../product/detail";
import { IProductDetailCost } from "../product/detailCost";
import { IMeasurementUnit } from "../product/measurementUnit";

export interface IPurchaseProduct {
    id: number;
    purchase_id: number;
    product_detail_cost_id: number;
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
    cost: IProductDetailCost;
};