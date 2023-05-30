import { createSlice } from '@reduxjs/toolkit';
import { ICustomerPaymentState } from 'src/interfaces/sale/redux/customerPaymentState';
import { getCustomerPaymentsAction } from '../actions/customerPayment';
import { MSalePayment } from 'src/models/sale/payment';

const initialState: ICustomerPaymentState = {
    payments: [],
    filteredPayments: null,
    cursor: null,
    filteredCursor: null
}

const slice = createSlice({
    initialState,
    name: 'accountReceivable',
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
        builder.addCase(getCustomerPaymentsAction.fulfilled, (state, action) => {
            const payments = action.payload.data.map((payment) => new MSalePayment(payment));
            state.payments = payments
        })
    },
})

export const { resetFilteredPayments, setCursor, setFilteredCursor } = slice.actions

export default slice