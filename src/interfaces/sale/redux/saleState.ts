import { MSalePayment } from 'src/models/sale/payment';
import { MSaleProduct } from 'src/models/sale/product';
import { MSale } from 'src/models/sale/sale';

export interface ISaleState {
    sales: MSale[],
    filteredSales: MSale[] | null;
    cursor: string | null;
    filteredCursor: string | null;
    currentSale: MSale | undefined,
    currentSaleProduct: MSaleProduct | undefined,
    currentSalePayment: MSalePayment | undefined
}