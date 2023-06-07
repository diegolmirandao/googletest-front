import { MSaleOrderProduct } from 'src/models/sale-order/product';
import { MSaleOrder } from 'src/models/sale-order/saleOrder';

export interface ISaleOrderState {
    saleOrders: MSaleOrder[],
    filteredSaleOrders: MSaleOrder[] | null;
    cursor: string | null;
    filteredCursor: string | null;
    currentSaleOrder: MSaleOrder | undefined,
    currentSaleOrderProduct: MSaleOrderProduct | undefined
}