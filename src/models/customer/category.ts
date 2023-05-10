import { ICustomerCategory } from "src/interfaces/customer/category";

export class MCustomerCategory {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(category: ICustomerCategory) {
        this.id = category.id;
        this.name = category.name;
        this.createdAt = category.created_at;
        this.updatedAt = category.updated_at;
    };
};