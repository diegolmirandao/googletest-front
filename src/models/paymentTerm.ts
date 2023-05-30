import { IPaymentTerm } from "src/interfaces/payment-term/paymentTerm";

export class MPaymentTerm {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(paymentTerm: IPaymentTerm) {
        this.id = paymentTerm.id;
        this.name = paymentTerm.name;
        this.createdAt = paymentTerm.created_at;
        this.updatedAt = paymentTerm.updated_at;
    };
};