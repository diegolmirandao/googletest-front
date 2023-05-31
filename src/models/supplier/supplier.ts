import { ISupplier } from "src/interfaces/supplier/supplier";
import { MSupplierAddress } from "./address";
import { MSupplierContact } from "./contact";

export class MSupplier {
    public id: number;
    public name: string;
    public identificationDocument: string;
    public email: string;
    public address: string;
    public createdAt: string;
    public updatedAt: string;
    public phones: string[];
    public contacts: MSupplierContact[];
    public addresses: MSupplierAddress[];

    constructor(supplier: ISupplier) {
        this.id = supplier.id;
        this.name = supplier.name;
        this.identificationDocument = supplier.identification_document;
        this.email = supplier.email;
        this.address = supplier.address;
        this.createdAt = supplier.created_at;
        this.updatedAt = supplier.updated_at;
        this.phones = supplier.phones.map(phone => String(phone));
        this.contacts = supplier.contacts.map(contact => new MSupplierContact(contact));
        this.addresses = supplier.addresses.map(address => new MSupplierAddress(address));
    };
};