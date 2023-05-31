import { ISupplierContact } from "src/interfaces/supplier/contact";

export class MSupplierContact {
    public id: number;
    public supplierId: number;
    public name: string;
    public phone: string;
    public email: string;
    public comments: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(contact: ISupplierContact) {
        this.id = contact.id;
        this.supplierId = contact.supplier_id;
        this.name = contact.name;
        this.phone = contact.phone;
        this.email = contact.email;
        this.comments = contact.comments;
        this.createdAt = contact.created_at;
        this.updatedAt = contact.updated_at;
    };
};