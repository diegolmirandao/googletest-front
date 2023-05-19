import { Dayjs } from "dayjs";

export interface IUpdateCustomer {
    customer_category_id: number;
    acquisition_channel_id: number;
    name: string;
    identification_document: string;
    email: string;
    birthday: string | Dayjs | null;
    address: string;
    phones: string[];
}