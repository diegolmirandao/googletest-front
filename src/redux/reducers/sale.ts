import { ISaleState } from '../../interfaces/sale/redux/saleState';
import { createSlice } from '@reduxjs/toolkit';
import { getSalesAction, addSaleAction, updateSaleAction, deleteSaleAction } from '../actions/sale';
import { deleteSaleProductAction, updateSaleProductAction, addSaleProductAction } from '../actions/sale';
import { deleteSalePaymentAction, updateSalePaymentAction, addSalePaymentAction } from '../actions/sale';
import { MSale } from 'src/models/sale/sale';

const initialState: ISaleState = {
    sales: [],
    filteredSales: null,
    cursor: null,
    filteredCursor: null,
    currentSale: undefined,
    currentSaleProduct: undefined,
    currentSalePayment: undefined
}

const slice = createSlice({
    initialState,
    name: 'sale',
    reducers: {
        resetFilteredSales(state) {
            state.filteredSales = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentSale(state, action) {
            state.currentSale = action.payload
        },
        setCurrentSaleProduct(state, action) {
            state.currentSaleProduct = action.payload
        },
        setCurrentSalePayment(state, action) {
            state.currentSalePayment = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getSalesAction.fulfilled, (state, action) => {
            const sales = action.payload.data.map((sale) => new MSale(sale));
            state.sales = sales
        })
        builder.addCase(addSaleAction.fulfilled, (state, action) => {
            const sale = new MSale(action.payload);
            state.sales = [sale, ...state.sales];
            state.currentSale = sale;
        })
        builder.addCase(updateSaleAction.fulfilled, (state, action) => {
            const updatePayload = new MSale(action.payload);
            state.sales = state.sales.map(sale => sale.id == updatePayload.id ? updatePayload : sale);
            state.currentSale = updatePayload;
        })
        builder.addCase(addSaleProductAction.fulfilled, (state, action) => {
            const addPayload = new MSale(action.payload);
            state.sales = state.sales.map(sale => sale.id == addPayload.id ? addPayload : sale);
            state.currentSale = addPayload;
        })
        builder.addCase(updateSaleProductAction.fulfilled, (state, action) => {
            const updatePayload = new MSale(action.payload);
            state.sales = state.sales.map(sale => sale.id == updatePayload.id ? updatePayload : sale);
            state.currentSale = updatePayload;
        })
        builder.addCase(deleteSaleProductAction.fulfilled, (state, action) => {
          const deletePayload = new MSale(action.payload);
          state.sales = state.sales.map(sale => sale.id == deletePayload.id ? deletePayload : sale);
          state.currentSale = deletePayload;
        });
        builder.addCase(addSalePaymentAction.fulfilled, (state, action) => {
            const addPayload = new MSale(action.payload);
            state.sales = state.sales.map(sale => sale.id == addPayload.id ? addPayload : sale);
            state.currentSale = addPayload;
        })
        builder.addCase(updateSalePaymentAction.fulfilled, (state, action) => {
            const updatePayload = new MSale(action.payload);
            state.sales = state.sales.map(sale => sale.id == updatePayload.id ? updatePayload : sale);
            state.currentSale = updatePayload;
        })
        builder.addCase(deleteSalePaymentAction.fulfilled, (state, action) => {
          const deletePayload = new MSale(action.payload);
          state.sales = state.sales.map(sale => sale.id == deletePayload.id ? deletePayload : sale);
          state.currentSale = deletePayload;
        });
        builder.addCase(deleteSaleAction.fulfilled, (state, action) => {
            const deletePayload = new MSale(action.payload);
            state.sales = state.sales.filter(sale => sale.id !== deletePayload.id);
        })
    },
})

export const { resetFilteredSales, setCursor, setFilteredCursor, setCurrentSale, setCurrentSaleProduct, setCurrentSalePayment } = slice.actions

export default slice