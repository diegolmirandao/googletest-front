import { ISaleOrderState } from '../../interfaces/sale-order/redux/saleOrderState';
import { createSlice } from '@reduxjs/toolkit';
import { getSaleOrdersAction, addSaleOrderAction, updateSaleOrderAction, deleteSaleOrderAction, cancelSaleOrderProductAction, cancelSaleOrderAction } from '../actions/saleOrder';
import { deleteSaleOrderProductAction, updateSaleOrderProductAction, addSaleOrderProductsAction } from '../actions/saleOrder';
import { MSaleOrder } from 'src/models/sale-order/saleOrder';

const initialState: ISaleOrderState = {
    saleOrders: [],
    filteredSaleOrders: null,
    cursor: null,
    filteredCursor: null,
    currentSaleOrder: undefined,
    currentSaleOrderProduct: undefined,
}

const slice = createSlice({
    initialState,
    name: 'saleOrder',
    reducers: {
        resetFilteredSaleOrders(state) {
            state.filteredSaleOrders = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentSaleOrder(state, action) {
            state.currentSaleOrder = action.payload
        },
        setCurrentSaleOrderProduct(state, action) {
            state.currentSaleOrderProduct = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getSaleOrdersAction.fulfilled, (state, action) => {
            const saleOrders = action.payload.data.map((saleOrder) => new MSaleOrder(saleOrder));
            state.saleOrders = saleOrders
        })
        builder.addCase(addSaleOrderAction.fulfilled, (state, action) => {
            const saleOrder = new MSaleOrder(action.payload);
            state.saleOrders = [saleOrder, ...state.saleOrders];
            state.currentSaleOrder = saleOrder;
        })
        builder.addCase(updateSaleOrderAction.fulfilled, (state, action) => {
            const updatePayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == updatePayload.id ? updatePayload : saleOrder);
            state.currentSaleOrder = updatePayload;
        })
        builder.addCase(addSaleOrderProductsAction.fulfilled, (state, action) => {
            const addPayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == addPayload.id ? addPayload : saleOrder);
            state.currentSaleOrder = addPayload;
        })
        builder.addCase(updateSaleOrderProductAction.fulfilled, (state, action) => {
            const updatePayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == updatePayload.id ? updatePayload : saleOrder);
            state.currentSaleOrder = updatePayload;
        })
        builder.addCase(cancelSaleOrderProductAction.fulfilled, (state, action) => {
            const updatePayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == updatePayload.id ? updatePayload : saleOrder);
            state.currentSaleOrder = updatePayload;
        })
        builder.addCase(deleteSaleOrderProductAction.fulfilled, (state, action) => {
          const deletePayload = new MSaleOrder(action.payload);
          state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == deletePayload.id ? deletePayload : saleOrder);
          state.currentSaleOrder = deletePayload;
        });
        builder.addCase(cancelSaleOrderAction.fulfilled, (state, action) => {
            const updatePayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.map(saleOrder => saleOrder.id == updatePayload.id ? updatePayload : saleOrder);
            state.currentSaleOrder = updatePayload;
        })
        builder.addCase(deleteSaleOrderAction.fulfilled, (state, action) => {
            const deletePayload = new MSaleOrder(action.payload);
            state.saleOrders = state.saleOrders.filter(saleOrder => saleOrder.id !== deletePayload.id);
        })
    },
})

export const { resetFilteredSaleOrders, setCursor, setFilteredCursor, setCurrentSaleOrder, setCurrentSaleOrderProduct } = slice.actions

export default slice