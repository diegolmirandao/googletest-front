import { MPaymentMethod } from 'src/models/paymentMethod';

export interface IPaymentMethodState {
    paymentMethods: MPaymentMethod[],
    currentPaymentMethod: MPaymentMethod | undefined
}