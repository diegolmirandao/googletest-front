import { Dayjs } from "dayjs";

export interface IUpdateSaleInstalment {
    number: number;
    expires_at: Dayjs | null;
    amount: number;
};