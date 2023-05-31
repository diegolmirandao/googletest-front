import { IPurchase } from 'src/interfaces/purchase/purchase';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdatePurchasePayment } from 'src/interfaces/purchase/addUpdatePayment';
import { IAddUpdatePurchase } from 'src/interfaces/purchase/addUpdate';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IAddPurchaseProduct } from 'src/interfaces/purchase/addProduct';
import { IUpdatePurchaseProduct } from 'src/interfaces/purchase/updateProduct';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';

export const getPurchasesAction = createAsyncThunk(
    'purchase/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: supplierResponse}: AxiosResponse<IResponseCursorPagination<IPurchase>> = await axios.get(`/purchases`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['purchases'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPurchaseAction = createAsyncThunk(
    'purchase/add',
    async (addData: IAddUpdatePurchase, {rejectWithValue}) => {
        try {
            const {data: purchaseResponse}: AxiosResponse<IPurchase> = await axios.post('/purchases', addData);

            return purchaseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePurchaseAction = createAsyncThunk(
    'purchase/update',
    async (updateData: IAddUpdatePurchase, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase } } = getState() as RootState;
            const {data: purchaseResponse}: AxiosResponse<IPurchase> = await axios.put(`/purchases/${currentPurchase?.id}`, updateData);

            return purchaseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPurchaseProductAction = createAsyncThunk(
    'purchaseProduct/add',
    async (addData: IAddPurchaseProduct, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase } } = getState() as RootState;
            const {data: purchaseProductResponse}: AxiosResponse<IPurchase> = await axios.post(`/purchases/${currentPurchase?.id}/products/`, addData);

            return purchaseProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePurchaseProductAction = createAsyncThunk(
    'purchaseProduct/update',
    async (updateData: IUpdatePurchaseProduct, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase, currentPurchaseProduct } } = getState() as RootState;
            const {data: purchaseProductResponse}: AxiosResponse<IPurchase> = await axios.put(`/purchases/${currentPurchase?.id}/products/${currentPurchaseProduct?.id}`, updateData);

            return purchaseProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePurchaseProductAction = createAsyncThunk(
    'purchaseProduct/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase, currentPurchaseProduct } } = getState() as RootState;
            const {data: purchaseProductResponse}: AxiosResponse<IPurchase> = await axios.delete(`/purchases/${currentPurchase?.id}/products/${currentPurchaseProduct?.id}`);

            return purchaseProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPurchasePaymentAction = createAsyncThunk(
    'purchasePayment/add',
    async (addData: IAddUpdatePurchasePayment, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase } } = getState() as RootState;
            const {data: purchasePaymentResponse}: AxiosResponse<IPurchase> = await axios.post(`/purchases/${currentPurchase?.id}/payments/`, addData);

            return purchasePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePurchasePaymentAction = createAsyncThunk(
    'purchasePayment/update',
    async (updateData: IAddUpdatePurchasePayment, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase, currentPurchasePayment } } = getState() as RootState;
            const {data: purchasePaymentResponse}: AxiosResponse<IPurchase> = await axios.put(`/purchases/${currentPurchase?.id}/payments/${currentPurchasePayment?.id}`, updateData);

            return purchasePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePurchasePaymentAction = createAsyncThunk(
    'purchasePayment/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase, currentPurchasePayment } } = getState() as RootState;
            const {data: purchasePaymentResponse}: AxiosResponse<IPurchase> = await axios.delete(`/purchases/${currentPurchase?.id}/payments/${currentPurchasePayment?.id}`);

            return purchasePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePurchaseAction = createAsyncThunk(
    'purchase/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { currentPurchase } } = getState() as RootState;
            const {data: purchaseResponse}: AxiosResponse<IPurchase> = await axios.delete(`/purchases/${currentPurchase?.id}`);

            return purchaseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);