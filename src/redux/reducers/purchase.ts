import { IPurchaseState } from '../../interfaces/purchase/redux/purchaseState';
import { createSlice } from '@reduxjs/toolkit';
import { getPurchasesAction, addPurchaseAction, updatePurchaseAction, deletePurchaseAction } from '../actions/purchase';
import { deletePurchaseProductAction, updatePurchaseProductAction, addPurchaseProductAction } from '../actions/purchase';
import { deletePurchasePaymentAction, updatePurchasePaymentAction, addPurchasePaymentAction } from '../actions/purchase';
import { MPurchase } from 'src/models/purchase/purchase';

const initialState: IPurchaseState = {
    purchases: [],
    filteredPurchases: null,
    cursor: null,
    filteredCursor: null,
    currentPurchase: undefined,
    currentPurchaseProduct: undefined,
    currentPurchasePayment: undefined
}

const slice = createSlice({
    initialState,
    name: 'purchase',
    reducers: {
        resetFilteredPurchases(state) {
            state.filteredPurchases = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentPurchase(state, action) {
            state.currentPurchase = action.payload
        },
        setCurrentPurchaseProduct(state, action) {
            state.currentPurchaseProduct = action.payload
        },
        setCurrentPurchasePayment(state, action) {
            state.currentPurchasePayment = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getPurchasesAction.fulfilled, (state, action) => {
            const purchases = action.payload.data.map((purchase) => new MPurchase(purchase));
            state.purchases = purchases
        })
        builder.addCase(addPurchaseAction.fulfilled, (state, action) => {
            const purchase = new MPurchase(action.payload);
            state.purchases = [purchase, ...state.purchases];
            state.currentPurchase = purchase;
        })
        builder.addCase(updatePurchaseAction.fulfilled, (state, action) => {
            const updatePayload = new MPurchase(action.payload);
            state.purchases = state.purchases.map(purchase => purchase.id == updatePayload.id ? updatePayload : purchase);
            state.currentPurchase = updatePayload;
        })
        builder.addCase(addPurchaseProductAction.fulfilled, (state, action) => {
            const addPayload = new MPurchase(action.payload);
            state.purchases = state.purchases.map(purchase => purchase.id == addPayload.id ? addPayload : purchase);
            state.currentPurchase = addPayload;
        })
        builder.addCase(updatePurchaseProductAction.fulfilled, (state, action) => {
            const updatePayload = new MPurchase(action.payload);
            state.purchases = state.purchases.map(purchase => purchase.id == updatePayload.id ? updatePayload : purchase);
            state.currentPurchase = updatePayload;
        })
        builder.addCase(deletePurchaseProductAction.fulfilled, (state, action) => {
          const deletePayload = new MPurchase(action.payload);
          state.purchases = state.purchases.map(purchase => purchase.id == deletePayload.id ? deletePayload : purchase);
          state.currentPurchase = deletePayload;
        });
        builder.addCase(addPurchasePaymentAction.fulfilled, (state, action) => {
            const addPayload = new MPurchase(action.payload);
            state.purchases = state.purchases.map(purchase => purchase.id == addPayload.id ? addPayload : purchase);
            state.currentPurchase = addPayload;
        })
        builder.addCase(updatePurchasePaymentAction.fulfilled, (state, action) => {
            const updatePayload = new MPurchase(action.payload);
            state.purchases = state.purchases.map(purchase => purchase.id == updatePayload.id ? updatePayload : purchase);
            state.currentPurchase = updatePayload;
        })
        builder.addCase(deletePurchasePaymentAction.fulfilled, (state, action) => {
          const deletePayload = new MPurchase(action.payload);
          state.purchases = state.purchases.map(purchase => purchase.id == deletePayload.id ? deletePayload : purchase);
          state.currentPurchase = deletePayload;
        });
        builder.addCase(deletePurchaseAction.fulfilled, (state, action) => {
            const deletePayload = new MPurchase(action.payload);
            state.purchases = state.purchases.filter(purchase => purchase.id !== deletePayload.id);
        })
    },
})

export const { resetFilteredPurchases, setCursor, setFilteredCursor, setCurrentPurchase, setCurrentPurchaseProduct, setCurrentPurchasePayment } = slice.actions

export default slice