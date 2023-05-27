import { IProductType } from "src/interfaces/product/type";

export class MProductType {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(type: IProductType) {
        this.id = type.id;
        this.name = type.name;
        this.createdAt = type.created_at;
        this.updatedAt = type.updated_at;
    };
};