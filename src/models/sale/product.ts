import { ISaleProduct } from 'src/interfaces/sale/product';
import { MProductDetailPrice } from '../product/detailPrice';
import { MMeasurementUnit } from '../product/measurementUnit';
import { MProductDetail } from '../product/detail';

export class MSaleProduct {
    public id: number;
    public saleId: number;
    public productDetailPriceId: number;
    public measurementUnitId: number;
    public quantity: number;
    public discount: number;
    public code: string;
    public name: string;
    public taxed: boolean;
    public tax: number;
    public percentage_taxed: number;
    public createdAt: string;
    public updatedAt: string;
    public productDetail: MProductDetail;
    public measurementUnit: MMeasurementUnit;
    public price: MProductDetailPrice;

    constructor(product: ISaleProduct) {
        this.id = product.id;
        this.saleId = product.sale_id;
        this.productDetailPriceId = product.product_detail_price_id;
        this.measurementUnitId = product.measurement_unit_id;
        this.quantity = product.quantity;
        this.discount = product.discount;
        this.code = product.code;
        this.name = product.name;
        this.taxed = product.taxed;
        this.tax = product.tax;
        this.percentage_taxed = product.percentage_taxed;
        this.createdAt = product.created_at;
        this.updatedAt = product.updated_at;
        this.productDetail = new MProductDetail(product.product_detail);
        this.measurementUnit = new MMeasurementUnit(product.measurement_unit);
        this.price = new MProductDetailPrice(product.price);
    }
};