import { Dayjs } from "dayjs";

export interface IUpdatePurchaseInstalment {
    id?: number | null;
    number: number;
    expires_at: Dayjs | null;
    amount: number;
};