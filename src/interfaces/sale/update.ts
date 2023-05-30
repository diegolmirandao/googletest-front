export interface IUpdateSale {
    customer_id: number;
    currency_id: number;
    establishment_id: number;
    point_of_sale_id: number;
    warehouse_id: number;
    seller_id: number;
    document_type_id: number;
    payment_term_id: number;
    billed_at: string;
    expires_at: string | null;
    comments: string | null;
};