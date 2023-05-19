import { ICustomer } from "src/interfaces/customer/customer";
import { MAcquisitionChannel } from "./acquisitionChannel";
import { MCustomerAddress } from "./address";
import { MCustomerBillingAddress } from "./billingAddress";
import { MCustomerCategory } from "./category";
import { MCustomerReference } from "./reference";

export class MCustomer {
    public id: number;
    public customerCategoryId: number;
    public acquisitionChannelId: number;
    public name: string;
    public identificationDocument: string;
    public email: string;
    public birthday: string;
    public address: string;
    public createdAt: string;
    public updatedAt: string;
    public category: MCustomerCategory;
    public acquisitionChannel: MAcquisitionChannel;
    public phones: string[];
    public billingAddresses: MCustomerBillingAddress[];
    public references: MCustomerReference[];
    public addresses: MCustomerAddress[];

    constructor(customer: ICustomer) {
        this.id = customer.id;
        this.customerCategoryId = customer.customer_category_id;
        this.acquisitionChannelId = customer.acquisition_channel_id;
        this.name = customer.name;
        this.identificationDocument = customer.identification_document;
        this.email = customer.email;
        this.birthday = customer.birthday;
        this.address = customer.address;
        this.createdAt = customer.created_at;
        this.updatedAt = customer.updated_at;
        this.category = new MCustomerCategory(customer.category);
        this.acquisitionChannel = new MAcquisitionChannel(customer.acquisition_channel);
        this.phones = customer.phones.map(phone => String(phone));
        this.billingAddresses = customer.billing_addresses.map(billingAddress => new MCustomerBillingAddress(billingAddress));
        this.references = customer.references.map(reference => new MCustomerReference(reference));
        this.addresses = customer.addresses.map(address => new MCustomerAddress(address));
    };
};