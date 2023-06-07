import { ISaleOrder } from 'src/interfaces/sale-order/saleOrder';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddSaleOrder } from 'src/interfaces/sale-order/add';
import { IUpdateSaleOrder } from 'src/interfaces/sale-order/update';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IAddSaleOrderProduct } from 'src/interfaces/sale-order/addProduct';
import { IUpdateSaleOrderProduct } from 'src/interfaces/sale-order/updateProduct';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';
import { ICancelSaleOrderProduct } from 'src/interfaces/sale-order/cancelProduct';

export const getSaleOrdersAction = createAsyncThunk(
    'saleOrder/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: customerResponse}: AxiosResponse<IResponseCursorPagination<ISaleOrder>> = await axios.get(`/sale-orders`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['saleOrders'].pageSize,
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

export const addSaleOrderAction = createAsyncThunk(
    'saleOrder/add',
    async (addData: IAddSaleOrder, {rejectWithValue}) => {
        try {
            const {data: saleOrderResponse}: AxiosResponse<ISaleOrder> = await axios.post('/sale-orders', addData);

            return saleOrderResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSaleOrderAction = createAsyncThunk(
    'saleOrder/update',
    async (updateData: IUpdateSaleOrder, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder } } = getState() as RootState;
            const {data: saleOrderResponse}: AxiosResponse<ISaleOrder> = await axios.put(`/sale-orders/${currentSaleOrder?.id}`, updateData);

            return saleOrderResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSaleOrderProductsAction = createAsyncThunk(
    'saleOrderProduct/add',
    async (addData: IAddSaleOrderProduct[], {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder } } = getState() as RootState;
            const {data: saleOrderProductResponse}: AxiosResponse<ISaleOrder> = await axios.post(`/sale-orders/${currentSaleOrder?.id}/products/`, addData);

            return saleOrderProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSaleOrderProductAction = createAsyncThunk(
    'saleOrderProduct/update',
    async (updateData: IUpdateSaleOrderProduct, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder, currentSaleOrderProduct } } = getState() as RootState;
            const {data: saleOrderProductResponse}: AxiosResponse<ISaleOrder> = await axios.put(`/sale-orders/${currentSaleOrder?.id}/products/${currentSaleOrderProduct?.id}`, updateData);

            return saleOrderProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const cancelSaleOrderProductAction = createAsyncThunk(
    'saleOrderProduct/cancel',
    async (updateData: ICancelSaleOrderProduct, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder, currentSaleOrderProduct } } = getState() as RootState;
            const {data: saleOrderProductResponse}: AxiosResponse<ISaleOrder> = await axios.put(`/sale-orders/${currentSaleOrder?.id}/products/cancel/${currentSaleOrderProduct?.id}`, updateData);

            return saleOrderProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSaleOrderProductAction = createAsyncThunk(
    'saleOrderProduct/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder, currentSaleOrderProduct } } = getState() as RootState;
            const {data: saleOrderProductResponse}: AxiosResponse<ISaleOrder> = await axios.delete(`/sale-orders/${currentSaleOrder?.id}/products/${currentSaleOrderProduct?.id}`);

            return saleOrderProductResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const cancelSaleOrderAction = createAsyncThunk(
    'saleOrder/cancel',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder } } = getState() as RootState;
            const {data: saleOrderResponse}: AxiosResponse<ISaleOrder> = await axios.put(`/sale-orders/cancel/${currentSaleOrder?.id}`);

            return saleOrderResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSaleOrderAction = createAsyncThunk(
    'saleOrder/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { saleOrderReducer: { currentSaleOrder } } = getState() as RootState;
            const {data: saleOrderResponse}: AxiosResponse<ISaleOrder> = await axios.delete(`/sale-orders/${currentSaleOrder?.id}`);

            return saleOrderResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);