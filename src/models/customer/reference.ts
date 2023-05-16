import { ICustomerReference } from "src/interfaces/customer/reference";
import { MCustomerReferenceType } from "./referenceType";

export class MCustomerReference {
    public id: number;
    public customerId: number;
    public customerReferenceTypeId: number;
    public name: string;
    public identificationDocument: string;
    public phone: string;
    public email: string;
    public address: string;
    public type: MCustomerReferenceType;
    public createdAt: string;
    public updatedAt: string;

    constructor(reference: ICustomerReference) {
        this.id = reference.id;
        this.customerId = reference.customer_id;
        this.customerReferenceTypeId = reference.customer_reference_type_id;
        this.name = reference.name;
        this.identificationDocument = reference.identification_document;
        this.phone = reference.phone;
        this.email = reference.email;
        this.address = reference.address;
        this.type = new MCustomerReferenceType(reference.type);
        this.createdAt = reference.created_at;
        this.updatedAt = reference.updated_at;
    };
};