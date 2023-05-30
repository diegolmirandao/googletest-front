import { MPaymentTerm } from 'src/models/paymentTerm';

export interface IPaymentTermState {
    paymentTerms: MPaymentTerm[],
    currentPaymentTerm: MPaymentTerm | undefined
}