import { createAction, createSlice } from '@reduxjs/toolkit'
import { getPaymentTermsAction, addPaymentTermAction, updatePaymentTermAction, deletePaymentTermAction } from '../actions/paymentTerm'
import { MPaymentTerm } from 'src/models/paymentTerm';
import { IPaymentTermState } from 'src/interfaces/payment-term/redux/paymentTermState';
import { IPaymentTerm } from 'src/interfaces/payment-term/paymentTerm';

const initialState: IPaymentTermState = {
    paymentTerms: [],
    currentPaymentTerm: undefined
}

const slice = createSlice({
    initialState,
    name: 'paymentTerm',
    reducers: {
        setCurrentPaymentTerm(state, action) {
            state.currentPaymentTerm = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IPaymentTerm[]>('paymentTerm/get'), (state, action) => {
            const paymentTerms = action.payload.map((paymentTerm) => new MPaymentTerm(paymentTerm));
            state.paymentTerms = paymentTerms;
        })
        builder.addCase(getPaymentTermsAction.fulfilled, (state, action) => {
            const paymentTerms = action.payload.map((paymentTerm) => new MPaymentTerm(paymentTerm));
            state.paymentTerms = paymentTerms;
        })
        builder.addCase(addPaymentTermAction.fulfilled, (state, action) => {
            const paymentTerm = new MPaymentTerm(action.payload);
            state.paymentTerms = [paymentTerm, ...state.paymentTerms];
            state.currentPaymentTerm = paymentTerm;
        })
        builder.addCase(updatePaymentTermAction.fulfilled, (state, action) => {
            const updatePayload = new MPaymentTerm(action.payload);
            state.paymentTerms = state.paymentTerms.map(paymentTerm => paymentTerm.id == updatePayload.id ? updatePayload : paymentTerm);
            state.currentPaymentTerm = updatePayload;
        })
        builder.addCase(deletePaymentTermAction.fulfilled, (state, action) => {
            const deletePayload = new MPaymentTerm(action.payload);
            state.paymentTerms = state.paymentTerms.filter(paymentTerm => paymentTerm.id !== deletePayload.id);
        })
    },
})

export const { setCurrentPaymentTerm } = slice.actions

export default slice