import { IBrand } from "src/interfaces/product/brand";

export class MBrand {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(brand: IBrand) {
        this.id = brand.id;
        this.name = brand.name;
        this.createdAt = brand.created_at;
        this.updatedAt = brand.updated_at;
    };
};