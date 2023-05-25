import { IProductType } from 'src/interfaces/product/type';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateProductPriceType } from 'src/interfaces/product/addUpdatePriceType';
import { IProductPriceType } from 'src/interfaces/product/priceType';

export const getProductPriceTypesAction = createAsyncThunk(
    'productPriceType/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: productPriceTypeResponse}: AxiosResponse<IProductType[]> = await axios.get('/product-price-types');

            return productPriceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductPriceTypeAction = createAsyncThunk(
    'productPriceType/add',
    async (addData: IAddUpdateProductPriceType, {rejectWithValue}) => {
        try {
            const {data: productPriceTypeResponse}: AxiosResponse<IProductPriceType> = await axios.post('/product-price-types', addData);

            return productPriceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductPriceTypeAction = createAsyncThunk(
    'productPriceType/update',
    async (updateData: IAddUpdateProductPriceType, {getState, rejectWithValue}) => {
        try {
            const { productPriceTypeReducer: { currentProductPriceType } } = getState() as RootState;
            const {data: productPriceTypeResponse}: AxiosResponse<IProductPriceType> = await axios.put(`/product-price-types/${currentProductPriceType?.id}`, updateData);

            return productPriceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductPriceTypeAction = createAsyncThunk(
    'productPriceType/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productPriceTypeReducer: { currentProductPriceType } } = getState() as RootState;
            const {data: productPriceTypeResponse}: AxiosResponse<IProductPriceType> = await axios.delete(`/product-price-types/${currentProductPriceType?.id}`);

            return productPriceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);