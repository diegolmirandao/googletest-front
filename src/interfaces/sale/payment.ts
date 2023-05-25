import { ICurrency } from "../currency/currency";
import { IPaymentMethod } from "../payment-method/paymentMethod";

export interface ISalePayment {
    id: number;
    sale_id: number;
    currency_id: number;
    payment_method_id: number;
    paid_at: string;
    amount: number;
    comments: string;
    created_at: string;
    updated_at: string;
    currency: ICurrency;
    method: IPaymentMethod;
};