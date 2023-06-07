import { ISaleOrderStatus } from "src/interfaces/sale-order/status";

export class MSaleOrderStatus {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(status: ISaleOrderStatus) {
        this.id = status.id;
        this.name = status.name;
        this.createdAt = status.created_at;
        this.updatedAt = status.updated_at;
    };
};