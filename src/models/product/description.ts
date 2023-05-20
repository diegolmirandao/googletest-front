import { IDescription } from "src/interfaces/product/description";

export class MDescription {
    public id: number;
    public name: string;
    public description: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(description: IDescription) {
        this.id = description.id;
        this.name = description.name;
        this.description = description.name;
        this.createdAt = description.created_at;
        this.updatedAt = description.updated_at;
    };
};