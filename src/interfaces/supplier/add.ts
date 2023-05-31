import { IAddUpdateSupplierAddress } from "./addUpdateAddress";
import { IAddUpdateSupplierContact } from "./addUpdateContact";

export interface IAddSupplier {
    name: string;
    identification_document: string;
    email: string;
    address: string;
    phones: string[];
    contacts: IAddUpdateSupplierContact[];
    addresses: IAddUpdateSupplierAddress[];
}