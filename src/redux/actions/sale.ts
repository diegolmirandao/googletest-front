import { ISale } from 'src/interfaces/sale/sale';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateSalePayment } from 'src/interfaces/sale/addUpdatePayment';
import { IAddUpdateSale } from 'src/interfaces/sale/addUpdate';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IUpdateSale } from 'src/interfaces/sale/update';
import { IAddSaleProduct } from 'src/interfaces/sale/addProduct';
import { IUpdateSaleProduct } from 'src/interfaces/sale/updateProduct';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';

export const getSalesAction = createAsyncThunk(
    'sale/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: customerResponse}: AxiosResponse<IResponseCursorPagination<ISale>> = await axios.get(`/sales`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['sales'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return customerResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSaleAction = createAsyncThunk(
    'sale/add',
    async (addData: IAddUpdateSale, {rejectWithValue}) => {
        try {
            const {data: saleResponse}: AxiosResponse<ISale> = await axios.post('/sales', addData);

            return saleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSaleAction = createAsyncThunk(
    'sale/update',
    async (updateData: IAddUpdateSale, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale } } = getState() as RootState;
            const {data: saleResponse}: AxiosResponse<ISale> = await axios.put(`/sales/${currentSale?.id}`, updateData);

            return saleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSaleProductAction = createAsyncThunk(
    'saleProduct/add',
    async (addData: IAddSaleProduct, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale } } = getState() as RootState;
            const {data: saleProductResponse}: AxiosResponse<ISale> = await axios.post(`/sales/${currentSale?.id}/products/`, addData);

            return saleProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSaleProductAction = createAsyncThunk(
    'saleProduct/update',
    async (updateData: IUpdateSaleProduct, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale, currentSaleProduct } } = getState() as RootState;
            const {data: saleProductResponse}: AxiosResponse<ISale> = await axios.put(`/sales/${currentSale?.id}/products/${currentSaleProduct?.id}`, updateData);

            return saleProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSaleProductAction = createAsyncThunk(
    'saleProduct/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale, currentSaleProduct } } = getState() as RootState;
            const {data: saleProductResponse}: AxiosResponse<ISale> = await axios.delete(`/sales/${currentSale?.id}/products/${currentSaleProduct?.id}`);

            return saleProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSalePaymentAction = createAsyncThunk(
    'salePayment/add',
    async (addData: IAddUpdateSalePayment, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale } } = getState() as RootState;
            const {data: salePaymentResponse}: AxiosResponse<ISale> = await axios.post(`/sales/${currentSale?.id}/payments/`, addData);

            return salePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSalePaymentAction = createAsyncThunk(
    'salePayment/update',
    async (updateData: IAddUpdateSalePayment, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale, currentSalePayment } } = getState() as RootState;
            const {data: salePaymentResponse}: AxiosResponse<ISale> = await axios.put(`/sales/${currentSale?.id}/payments/${currentSalePayment?.id}`, updateData);

            return salePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSalePaymentAction = createAsyncThunk(
    'salePayment/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale, currentSalePayment } } = getState() as RootState;
            const {data: salePaymentResponse}: AxiosResponse<ISale> = await axios.delete(`/sales/${currentSale?.id}/payments/${currentSalePayment?.id}`);

            return salePaymentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSaleAction = createAsyncThunk(
    'sale/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { currentSale } } = getState() as RootState;
            const {data: saleResponse}: AxiosResponse<ISale> = await axios.delete(`/sales/${currentSale?.id}`);

            return saleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);