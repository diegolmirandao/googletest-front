import { IAddPhone } from "../phone/add";
import { IAddUpdateCustomerAddress } from "./addUpdateAddress";
import { IAddUpdateCustomerBillingAddress } from "./addUpdateBillingAddress";
import { IAddUpdateCustomerReference } from "./addUpdateReference";

export interface IAddCustomer {
    customer_category_id: number;
    acquisition_channel_id: number;
    name: string;
    identification_document: string;
    email: string;
    birthday: string;
    address: string;
    phones: string[];
    billing_addresses: IAddUpdateCustomerBillingAddress[];
    references: IAddUpdateCustomerReference[];
    addresses: IAddUpdateCustomerAddress[];
}