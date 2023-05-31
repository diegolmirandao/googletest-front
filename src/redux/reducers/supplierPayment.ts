import { createSlice } from '@reduxjs/toolkit';
import { ISupplierPaymentState } from 'src/interfaces/purchase/redux/supplierPaymentState';
import { getSupplierPaymentsAction } from '../actions/supplierPayment';
import { MPurchasePayment } from 'src/models/purchase/payment';

const initialState: ISupplierPaymentState = {
    payments: [],
    filteredPayments: null,
    cursor: null,
    filteredCursor: null
}

const slice = createSlice({
    initialState,
    name: 'supplierPayment',
    reducers: {
        resetFilteredPayments(state) {
            state.filteredPayments = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getSupplierPaymentsAction.fulfilled, (state, action) => {
            const payments = action.payload.data.map((payment) => new MPurchasePayment(payment));
            state.payments = payments
        })
    },
})

export const { resetFilteredPayments, setCursor, setFilteredCursor } = slice.actions

export default slice