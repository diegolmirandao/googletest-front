import { IPaymentMethod } from "src/interfaces/payment-method/paymentMethod";

export class MPaymentMethod {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(paymentMethod: IPaymentMethod) {
        this.id = paymentMethod.id;
        this.name = paymentMethod.name;
        this.createdAt = paymentMethod.created_at;
        this.updatedAt = paymentMethod.updated_at;
    };
};