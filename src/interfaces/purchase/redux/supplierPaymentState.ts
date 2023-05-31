import { MPurchasePayment } from 'src/models/purchase/payment';

export interface ISupplierPaymentState {
    payments: MPurchasePayment[],
    filteredPayments: MPurchasePayment[] | null;
    cursor: string | null;
    filteredCursor: string | null;
}