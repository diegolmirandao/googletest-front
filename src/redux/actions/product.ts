import { IUpdateProduct } from '../../interfaces/product/update';
import { IProduct } from 'src/interfaces/product/product';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateProductDetail } from 'src/interfaces/product/addUpdateDetail';
import { IAddProduct } from 'src/interfaces/product/add';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IProductDetail } from 'src/interfaces/product/detail';
import requestParamConfig from 'src/config/requestParam';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import { IAddUpdateProductDetailPrice } from 'src/interfaces/product/addDetailPrice';
import { IAddUpdateProductDetailCost } from 'src/interfaces/product/addUpdateDetailCost';

export const getProductsAction = createAsyncThunk(
    'product/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: customerResponse}: AxiosResponse<IResponseCursorPagination<IProduct>> = await axios.get(`/products`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['products'].pageSize,
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

export const addProductAction = createAsyncThunk(
    'product/add',
    async (addData: IAddProduct, {rejectWithValue}) => {
        try {
            const {data: productResponse}: AxiosResponse<IProduct> = await axios.post('/products', addData);

            return productResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductAction = createAsyncThunk(
    'product/update',
    async (updateData: IUpdateProduct, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct } } = getState() as RootState;
            const {data: productResponse}: AxiosResponse<IProduct> = await axios.put(`/products/${currentProduct?.id}`, updateData);

            return productResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const getProductDetailsAction = createAsyncThunk(
    'productDetail/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: customerResponse}: AxiosResponse<IResponseCursorPagination<IProductDetail>> = await axios.get(`/product-details`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['products'].pageSize,
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

export const addProductDetailAction = createAsyncThunk(
    'productDetail/add',
    async (addData: IAddUpdateProductDetail, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct } } = getState() as RootState;
            const {data: productDetailResponse}: AxiosResponse<IProduct> = await axios.post(`/products/${currentProduct?.id}/details/`, addData);

            return productDetailResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductDetailAction = createAsyncThunk(
    'productDetail/update',
    async (updateData: IAddUpdateProductDetail, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail } } = getState() as RootState;
            const {data: productDetailResponse}: AxiosResponse<IProduct> = await axios.put(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}`, updateData);

            return productDetailResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductDetailAction = createAsyncThunk(
    'productDetail/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail } } = getState() as RootState;
            const {data: productDetailResponse}: AxiosResponse<IProduct> = await axios.delete(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}`);

            return productDetailResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductDetailPriceAction = createAsyncThunk(
    'productDetailPrice/add',
    async (addData: IAddUpdateProductDetailPrice, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail } } = getState() as RootState;
            const {data: productDetailPriceResponse}: AxiosResponse<IProduct> = await axios.post(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/prices/`, addData);

            return productDetailPriceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductDetailPriceAction = createAsyncThunk(
    'productDetailPrice/update',
    async (updateData: IAddUpdateProductDetailPrice, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail, currentProductDetailPrice } } = getState() as RootState;
            const {data: productDetailPriceResponse}: AxiosResponse<IProduct> = await axios.put(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/prices/${currentProductDetailPrice?.id}`, updateData);

            return productDetailPriceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductDetailPriceAction = createAsyncThunk(
    'productDetailPrice/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail, currentProductDetailPrice } } = getState() as RootState;
            const {data: productDetailPriceResponse}: AxiosResponse<IProduct> = await axios.delete(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/prices/${currentProductDetailPrice?.id}`);

            return productDetailPriceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductDetailCostAction = createAsyncThunk(
    'productDetailCost/add',
    async (addData: IAddUpdateProductDetailCost, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail } } = getState() as RootState;
            const {data: productDetailCostResponse}: AxiosResponse<IProduct> = await axios.post(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/costs/`, addData);

            return productDetailCostResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductDetailCostAction = createAsyncThunk(
    'productDetailCost/update',
    async (updateData: IAddUpdateProductDetailCost, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail, currentProductDetailCost } } = getState() as RootState;
            const {data: productDetailCostResponse}: AxiosResponse<IProduct> = await axios.put(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/costs/${currentProductDetailCost?.id}`, updateData);

            return productDetailCostResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductDetailCostAction = createAsyncThunk(
    'productDetailCost/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct, currentProductDetail, currentProductDetailCost } } = getState() as RootState;
            const {data: productDetailCostResponse}: AxiosResponse<IProduct> = await axios.delete(`/products/${currentProduct?.id}/details/${currentProductDetail?.id}/costs/${currentProductDetailCost?.id}`);

            return productDetailCostResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductAction = createAsyncThunk(
    'product/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productReducer: { currentProduct } } = getState() as RootState;
            const {data: productResponse}: AxiosResponse<IProduct> = await axios.delete(`/products/${currentProduct?.id}`);

            return productResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);