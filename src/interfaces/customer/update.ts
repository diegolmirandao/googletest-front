import { IAddPhone } from "../phone/add";

export interface IUpdateCustomer {
    customer_category_id: number;
    acquisition_channel_id: number;
    name: string;
    identification_document: string;
    email: string;
    birthday: string;
    address: string;
    phones: string[];
}