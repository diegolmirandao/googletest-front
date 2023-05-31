import { ISupplierAddress } from "./address";
import { ISupplierContact } from "./contact";

export interface ISupplier {
    id: number;
    name: string;
    identification_document: string;
    email: string;
    address: string;
    created_at: string;
    updated_at: string;
    phones: string[];
    contacts: ISupplierContact[];
    addresses: ISupplierAddress[];
}