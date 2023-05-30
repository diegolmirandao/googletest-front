import { Dayjs } from "dayjs";

export interface IUpdateSaleInstalment {
    id?: number | null;
    number: number;
    expires_at: Dayjs | null;
    amount: number;
};