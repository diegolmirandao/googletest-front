import { MPurchasePayment } from 'src/models/purchase/payment';
import { MPurchaseProduct } from 'src/models/purchase/product';
import { MPurchase } from 'src/models/purchase/purchase';

export interface IPurchaseState {
    purchases: MPurchase[],
    filteredPurchases: MPurchase[] | null;
    cursor: string | null;
    filteredCursor: string | null;
    currentPurchase: MPurchase | undefined,
    currentPurchaseProduct: MPurchaseProduct | undefined,
    currentPurchasePayment: MPurchasePayment | undefined
}