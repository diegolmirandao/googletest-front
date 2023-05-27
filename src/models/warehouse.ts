import { IWarehouse } from "src/interfaces/warehouse/warehouse";

export class MWarehouse {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(warehouse: IWarehouse) {
        this.id = warehouse.id;
        this.name = warehouse.name;
        this.createdAt = warehouse.created_at;
        this.updatedAt = warehouse.updated_at;
    };
};