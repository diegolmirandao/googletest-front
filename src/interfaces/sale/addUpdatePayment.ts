import { Dayjs } from "dayjs";

export interface IAddUpdateSalePayment {
    id?: number | null;
    payment_method_id: number;
    currency_id: number;
    paid_at: Dayjs | null;
    amount: number;
    comments: string | null;
};