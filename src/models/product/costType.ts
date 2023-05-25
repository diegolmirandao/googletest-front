import { IProductCostType } from "src/interfaces/product/costType";

export class MProductCostType {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(type: IProductCostType) {
        this.id = type.id;
        this.name = type.name;
        this.createdAt = type.created_at;
        this.updatedAt = type.updated_at;
    };
};