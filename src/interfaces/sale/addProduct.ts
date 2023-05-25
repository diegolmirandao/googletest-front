export interface IAddSaleProduct {
    product_detail_price_id: number;
    measurement_unit_id: number;
    quantity: number;
    discount: number;
    code: string;
    name: string;
    taxed: boolean;
    tax: number;
    percentage_taxed: number;
};