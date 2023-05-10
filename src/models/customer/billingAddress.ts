import { ICustomerBillingAddress } from "src/interfaces/customer/billingAddress";

export class MCustomerBillingAddress {
    public id: number;
    public customerId: number;
    public name: string;
    public identificationDocument: string;
    public phone: string;
    public address: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(reference: ICustomerBillingAddress) {
        this.id = reference.id;
        this.customerId = reference.customer_id;
        this.name = reference.name;
        this.identificationDocument = reference.identification_document;
        this.phone = reference.phone;
        this.address = reference.address;
        this.createdAt = reference.created_at;
        this.updatedAt = reference.updated_at;
    };
};