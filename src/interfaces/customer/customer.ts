import { IPhone } from "../phone/phone";
import { IAcquisitionChannel } from "./acquisitionChannel";
import { ICustomerAddress } from "./address";
import { ICustomerBillingAddress } from "./billingAddress";
import { ICustomerCategory } from "./category";
import { ICustomerReference } from "./reference";

export interface ICustomer {
    id: number;
    customer_category_id: number;
    acquisition_channel_id: number;
    name: string;
    identification_document: string;
    email: string;
    birthday: string;
    address: string;
    created_at: string;
    updated_at: string;
    category: ICustomerCategory;
    acquisition_channel: IAcquisitionChannel;
    phones: IPhone[];
    billing_addresses: ICustomerBillingAddress[];
    references: ICustomerReference[];
    addresses: ICustomerAddress[];
}