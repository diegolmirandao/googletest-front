import { createAction, createSlice } from '@reduxjs/toolkit'
import { getPaymentMethodsAction, addPaymentMethodAction, updatePaymentMethodAction, deletePaymentMethodAction } from '../actions/paymentMethod'
import { MPaymentMethod } from 'src/models/paymentMethod';
import { IPaymentMethodState } from 'src/interfaces/payment-method/redux/paymentMethodState';
import { IPaymentMethod } from 'src/interfaces/payment-method/paymentMethod';

const initialState: IPaymentMethodState = {
    paymentMethods: [],
    currentPaymentMethod: undefined
}

const slice = createSlice({
    initialState,
    name: 'paymentMethod',
    reducers: {
        setCurrentPaymentMethod(state, action) {
            state.currentPaymentMethod = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IPaymentMethod[]>('paymentMethod/get'), (state, action) => {
            const paymentMethods = action.payload.map((paymentMethod) => new MPaymentMethod(paymentMethod));
            state.paymentMethods = paymentMethods;
        })
        builder.addCase(getPaymentMethodsAction.fulfilled, (state, action) => {
            const paymentMethods = action.payload.map((paymentMethod) => new MPaymentMethod(paymentMethod));
            state.paymentMethods = paymentMethods;
        })
        builder.addCase(addPaymentMethodAction.fulfilled, (state, action) => {
            const paymentMethod = new MPaymentMethod(action.payload);
            state.paymentMethods = [paymentMethod, ...state.paymentMethods];
            state.currentPaymentMethod = paymentMethod;
        })
        builder.addCase(updatePaymentMethodAction.fulfilled, (state, action) => {
            const updatePayload = new MPaymentMethod(action.payload);
            state.paymentMethods = state.paymentMethods.map(paymentMethod => paymentMethod.id == updatePayload.id ? updatePayload : paymentMethod);
            state.currentPaymentMethod = updatePayload;
        })
        builder.addCase(deletePaymentMethodAction.fulfilled, (state, action) => {
            const deletePayload = new MPaymentMethod(action.payload);
            state.paymentMethods = state.paymentMethods.filter(paymentMethod => paymentMethod.id !== deletePayload.id);
        })
    },
})

export const { setCurrentPaymentMethod } = slice.actions

export default slice