import { IProductDetail } from "src/interfaces/product/detail";
import { MImage } from "../image";
import { MDescription } from "./description";
import { MProduct } from "./product";
import { MProductDetailPrice } from "./detailPrice";
import { MProductDetailStock } from "./detailStock";
import { MProductDetailVariant } from "./detailVariant";
import { MProductDetailCost } from "./detailCost";

export class MProductDetail {
    public id: number;
    public productId: number;
    public status: boolean;
    public createdAt: string;
    public updatedAt: string;
    public name: string;
    public product: MProduct;
    public codes: string[];
    public costs: MProductDetailCost[];
    public prices: MProductDetailPrice[];
    public stock: MProductDetailStock[];
    public variants: MProductDetailVariant[];
    public descriptions: MDescription[];
    public images: MImage[];

    constructor(detail: IProductDetail) {
        this.id = detail.id;
        this.productId = detail.product_id;
        this.status = detail.status;
        this.createdAt = detail.created_at;
        this.updatedAt = detail.updated_at;
        this.name = detail.name;
        this.product = new MProduct(detail.product);
        this.codes = detail.codes;
        this.costs = detail.costs.map(cost => new MProductDetailCost(cost));
        this.prices = detail.prices.map(price => new MProductDetailPrice(price));
        this.stock = detail.stock.map(stock => new MProductDetailStock(stock));
        this.variants = detail.variants.map(variant => new MProductDetailVariant(variant));
        this.descriptions = detail.descriptions.map(description => new MDescription(description));
        this.images = detail.images.map(image => new MImage(image));
    };
};