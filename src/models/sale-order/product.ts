import { MProductDetailPrice } from '../product/detailPrice';
import { MMeasurementUnit } from '../product/measurementUnit';
import { MProductDetail } from '../product/detail';
import { MSaleOrderStatus } from './status';
import { ISaleOrderProduct } from 'src/interfaces/sale-order/product';

export class MSaleOrderProduct {
    public id: number;
    public saleOrderId: number;
    public productDetailPriceId: number;
    public measurementUnitId: number;
    public statusId: number;
    public quantity: number;
    public billedQuantity: number;
    public canceledQuantity: number;
    public discount: number;
    public code: string;
    public name: string;
    public taxed: boolean;
    public tax: number;
    public percentageTaxed: number;
    public comments: string;
    public createdAt: string;
    public updatedAt: string;
    public productDetail: MProductDetail;
    public measurementUnit: MMeasurementUnit;
    public price: MProductDetailPrice;
    public status: MSaleOrderStatus;

    constructor(product: ISaleOrderProduct) {
        this.id = product.id;
        this.saleOrderId = product.sale_order_id;
        this.productDetailPriceId = product.product_detail_price_id;
        this.measurementUnitId = product.measurement_unit_id;
        this.statusId = product.measurement_unit_id;
        this.quantity = product.quantity;
        this.billedQuantity = product.billed_quantity;
        this.canceledQuantity = product.canceled_quantity;
        this.discount = product.discount;
        this.code = product.code;
        this.name = product.name;
        this.taxed = product.taxed;
        this.tax = product.tax;
        this.percentageTaxed = product.percentage_taxed;
        this.comments = product.comments;
        this.createdAt = product.created_at;
        this.updatedAt = product.updated_at;
        this.productDetail = new MProductDetail(product.product_detail);
        this.measurementUnit = new MMeasurementUnit(product.measurement_unit);
        this.price = new MProductDetailPrice(product.price);
        this.status = new MSaleOrderStatus(product.status);
    }
};