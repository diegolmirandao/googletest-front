import { IPurchasePayment } from 'src/interfaces/purchase/payment';
import { MPaymentMethod } from '../paymentMethod';
import { MCurrency } from '../currency';

export class MPurchasePayment {
    public id: number;
    public purchaseId: number;
    public currencyId: number;
    public paymentMethodId: number;
    public paidAt: string;
    public amount: number;
    public comments: string;
    public createdAt: string;
    public updatedAt: string;
    public currency: MCurrency;
    public method: MPaymentMethod;

    constructor(payment: IPurchasePayment) {
        this.id = payment.id;
        this.purchaseId = payment.purchase_id;
        this.currencyId = payment.currency_id;
        this.paymentMethodId = payment.payment_method_id;
        this.paidAt = payment.paid_at;
        this.amount = payment.amount;
        this.comments = payment.comments;
        this.createdAt = payment.created_at;
        this.updatedAt = payment.updated_at;
        this.currency = new MCurrency(payment.currency);
        this.method = new MPaymentMethod(payment.method);
    }
};