import { createAction, createSlice } from '@reduxjs/toolkit'
import { getSaleOrderStatusesAction } from '../actions/saleOrderStatus'
import { MSaleOrderStatus } from 'src/models/sale-order/status';
import { ISaleOrderStatusState } from 'src/interfaces/sale-order/redux/statusState';
import { ISaleOrderStatus } from 'src/interfaces/sale-order/status';

const initialState: ISaleOrderStatusState = {
    saleOrderStatuses: []
}

const slice = createSlice({
    initialState,
    name: 'saleOrderStatus',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(createAction<ISaleOrderStatus[]>('saleOrderStatus/get'), (state, action) => {
            const saleOrderStatuses = action.payload.map((saleOrderStatus) => new MSaleOrderStatus(saleOrderStatus));
            state.saleOrderStatuses = saleOrderStatuses;
        })
        builder.addCase(getSaleOrderStatusesAction.fulfilled, (state, action) => {
            const saleOrderStatuses = action.payload.map((saleOrderStatus) => new MSaleOrderStatus(saleOrderStatus));
            state.saleOrderStatuses = saleOrderStatuses;
        })
    },
})

export const { } = slice.actions

export default slice