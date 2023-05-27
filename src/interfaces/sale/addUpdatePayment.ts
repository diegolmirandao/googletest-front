import { Dayjs } from "dayjs";

export interface IAddUpdateSalePayment {
    payment_method_id: number;
    currency_id: number;
    paid_at: Dayjs | null;
    amount: number;
    comments: string | null;
};