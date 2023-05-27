import { IProductType } from 'src/interfaces/product/type';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateProductCostType } from 'src/interfaces/product/addUpdateCostType';
import { IProductCostType } from 'src/interfaces/product/costType';

export const getProductCostTypesAction = createAsyncThunk(
    'productCostType/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: productCostTypeResponse}: AxiosResponse<IProductType[]> = await axios.get('/product-cost-types');

            return productCostTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductCostTypeAction = createAsyncThunk(
    'productCostType/add',
    async (addData: IAddUpdateProductCostType, {rejectWithValue}) => {
        try {
            const {data: productCostTypeResponse}: AxiosResponse<IProductCostType> = await axios.post('/product-cost-types', addData);

            return productCostTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductCostTypeAction = createAsyncThunk(
    'productCostType/update',
    async (updateData: IAddUpdateProductCostType, {getState, rejectWithValue}) => {
        try {
            const { productCostTypeReducer: { currentProductCostType } } = getState() as RootState;
            const {data: productCostTypeResponse}: AxiosResponse<IProductCostType> = await axios.put(`/product-cost-types/${currentProductCostType?.id}`, updateData);

            return productCostTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductCostTypeAction = createAsyncThunk(
    'productCostType/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productCostTypeReducer: { currentProductCostType } } = getState() as RootState;
            const {data: productCostTypeResponse}: AxiosResponse<IProductCostType> = await axios.delete(`/product-cost-types/${currentProductCostType?.id}`);

            return productCostTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);