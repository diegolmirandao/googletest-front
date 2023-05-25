import { IProductDetailCost } from "src/interfaces/product/detailCost";
import { MCurrency } from "../currency";
import { MProductCostType } from "./costType";

export class MProductDetailCost {
    public id: number;
    public productDetailId: number;
    public costTypeId: number;
    public amount: number;
    public createdBy: number;
    public updatedBy: number;
    public createdAt: string;
    public updatedAt: string;
    public type: MProductCostType;
    public currency: MCurrency;

    constructor(detailCost: IProductDetailCost) {
        this.id = detailCost.id;
        this.productDetailId = detailCost.product_detail_id;
        this.costTypeId = detailCost.cost_type_id;
        this.amount = detailCost.amount;
        this.createdBy = detailCost.created_by;
        this.updatedBy = detailCost.updated_by;
        this.createdAt = detailCost.created_at;
        this.updatedAt = detailCost.updated_at;
        this.type = new MProductCostType(detailCost.type);
        this.currency = new MCurrency(detailCost.currency);
    };
};