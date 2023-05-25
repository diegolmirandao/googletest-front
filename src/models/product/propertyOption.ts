import { IPropertyOption } from "src/interfaces/product/propertyOptions";

export class MPropertyOption {
    public id: number;
    public propertyId: number;
    public value: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(option: IPropertyOption) {
        this.id = option.id;
        this.propertyId = option.property_id;
        this.value = option.value;
        this.createdAt = option.created_at;
        this.updatedAt = option.updated_at;
    };
};