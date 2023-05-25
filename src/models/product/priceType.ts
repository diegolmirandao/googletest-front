import { IProductPriceType } from "src/interfaces/product/priceType";

export class MProductPriceType {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(type: IProductPriceType) {
        this.id = type.id;
        this.name = type.name;
        this.createdAt = type.created_at;
        this.updatedAt = type.updated_at;
    };
};