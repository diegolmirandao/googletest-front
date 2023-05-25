export interface IAddUpdateSalePayment {
    payment_method_id: number;
    currency_id: number;
    paid_at: string | Date;
    amount: number;
    comments: string | null;
};