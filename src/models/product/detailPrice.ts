import { IProductDetailPrice } from "src/interfaces/product/detailPrice";
import { MCurrency } from "../currency";
import { MProductPriceType } from "./priceType";

export class MProductDetailPrice {
    public id: number;
    public productDetailId: number;
    public priceTypeId: number;
    public amount: number;
    public createdBy: number;
    public updatedBy: number;
    public createdAt: string;
    public updatedAt: string;
    public type: MProductPriceType;
    public currency: MCurrency;

    constructor(detailPrice: IProductDetailPrice) {
        this.id = detailPrice.id;
        this.productDetailId = detailPrice.product_detail_id;
        this.priceTypeId = detailPrice.price_type_id;
        this.amount = detailPrice.amount;
        this.createdBy = detailPrice.created_by;
        this.updatedBy = detailPrice.updated_by;
        this.createdAt = detailPrice.created_at;
        this.updatedAt = detailPrice.updated_at;
        this.type = new MProductPriceType(detailPrice.type);
        this.currency = new MCurrency(detailPrice.currency);
    };
};