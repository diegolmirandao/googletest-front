import { IProductDetailStock } from "src/interfaces/product/detailStock";
import { MWarehouse } from "../warehouse";

export class MProductDetailStock {
    public id: number;
    public productDetailId: number;
    public warehouseId: number;
    public stock: number;
    public createdAt: string;
    public updatedAt: string;
    public warehouse: MWarehouse;

    constructor(detailStock: IProductDetailStock) {
        this.id = detailStock.id;
        this.productDetailId = detailStock.product_detail_id;
        this.warehouseId = detailStock.warehouse_id;
        this.stock = detailStock.stock;
        this.createdAt = detailStock.created_at;
        this.updatedAt = detailStock.updated_at;
        this.warehouse = new MWarehouse(detailStock.warehouse);
    };
};