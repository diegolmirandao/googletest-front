import { MSalePayment } from 'src/models/sale/payment';

export interface ICustomerPaymentState {
    payments: MSalePayment[],
    filteredPayments: MSalePayment[] | null;
    cursor: string | null;
    filteredCursor: string | null;
}