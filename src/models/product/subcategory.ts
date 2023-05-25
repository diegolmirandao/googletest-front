import { IProductSubcategory } from "src/interfaces/product/subcategory";

export class MProductSubcategory {
    public id: number;
    public productCategoryId: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(subcategory: IProductSubcategory) {
        this.id = subcategory.id;
        this.productCategoryId = subcategory.product_category_id;
        this.name = subcategory.name;
        this.createdAt = subcategory.created_at;
        this.updatedAt = subcategory.updated_at;
    };
};