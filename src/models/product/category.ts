import { IProductCategory } from "src/interfaces/product/category";
import { MProductSubcategory } from "./subcategory";

export class MProductCategory {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;
    public subcategories: MProductSubcategory[];

    constructor(category: IProductCategory) {
        this.id = category.id;
        this.name = category.name;
        this.createdAt = category.created_at;
        this.updatedAt = category.updated_at;
        this.subcategories = category.subcategories.map(subcategory => new MProductSubcategory(subcategory));
    };
};