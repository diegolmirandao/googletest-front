import { ICustomerReferenceType } from "./referenceType";

export interface ICustomerReference {
    id: number;
    customer_id: number;
    customer_reference_type_id: number;
    name: string;
    identification_document: string;
    phone: string;
    email: string;
    address: string;
    type: ICustomerReferenceType;
    created_at: string;
    updated_at: string;
}