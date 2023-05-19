import { ICustomerReferenceType } from "src/interfaces/customer/referenceType";

export class MCustomerReferenceType {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(type: ICustomerReferenceType) {
        this.id = type.id;
        this.name = type.name;
        this.createdAt = type.created_at;
        this.updatedAt = type.updated_at;
    };
};