import { MCurrency } from '../currency';
import { MCustomer } from '../customer/customer';
import { MPointOfSale } from '../pointOfSale';
import { MUser } from '../user/user';
import { MWarehouse } from '../warehouse';
import { MSaleOrderProduct } from './product';
import { MEstablishment } from '../establishment';
import { MSaleOrderStatus } from './status';
import { ISaleOrder } from 'src/interfaces/sale-order/saleOrder';

export class MSaleOrder {
    public id: number;
    public customerId: number;
    public currencyId: number;
    public pointOfSaleId: number;
    public warehouseId: number;
    public sellerId: number;
    public statusId: number;
    public amount: number;
    public orderedAt: string;
    public expiresAt: string | null;
    public billedAt: string | null;
    public name: string;
    public identificationDocument: string;
    public phone: string | null;
    public email: string | null;
    public address: string | null;
    public comments: string | null;
    public createdAt: string;
    public updatedAt: string;
    public customer: MCustomer;
    public currency: MCurrency;
    public establishment: MEstablishment;
    public pointOfSale: MPointOfSale;
    public warehouse: MWarehouse;
    public seller: MUser;
    public status: MSaleOrderStatus;
    public products: MSaleOrderProduct[];

    constructor(saleOrder: ISaleOrder) {
        this.id = saleOrder.id;
        this.customerId = saleOrder.customer_id;
        this.currencyId = saleOrder.currency_id;
        this.pointOfSaleId = saleOrder.point_of_sale_id;
        this.warehouseId = saleOrder.warehouse_id;
        this.sellerId = saleOrder.seller_id;
        this.statusId = saleOrder.status_id;
        this.amount = saleOrder.amount;
        this.orderedAt = saleOrder.ordered_at;
        this.expiresAt = saleOrder.expires_at;
        this.billedAt = saleOrder.billed_at;
        this.name = saleOrder.name;
        this.identificationDocument = saleOrder.identification_document;
        this.phone = saleOrder.phone;
        this.email = saleOrder.email;
        this.address = saleOrder.address;
        this.comments = saleOrder.comments;
        this.createdAt = saleOrder.created_at;
        this.updatedAt = saleOrder.updated_at;
        this.customer = new MCustomer(saleOrder.customer);
        this.currency = new MCurrency(saleOrder.currency);
        this.establishment = new MEstablishment(saleOrder.establishment);
        this.pointOfSale = new MPointOfSale(saleOrder.point_of_sale);
        this.warehouse = new MWarehouse(saleOrder.warehouse);
        this.seller = new MUser(saleOrder.seller);
        this.status = new MSaleOrderStatus(saleOrder.status);
        this.products = saleOrder.products.map(product => new MSaleOrderProduct(product));
    }
};