import { IAddUpdateBrand } from '../../interfaces/product/addUpdateBrand';
import { IBrand } from 'src/interfaces/product/brand';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getBrandsAction = createAsyncThunk(
    'brand/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: brandResponse}: AxiosResponse<IBrand[]> = await axios.get(`/brands`);

            return brandResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addBrandAction = createAsyncThunk(
    'brand/add',
    async (addData: IAddUpdateBrand, {rejectWithValue}) => {
        try {
            const {data: brandResponse}: AxiosResponse<IBrand> = await axios.post('/brands', addData);

            return brandResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateBrandAction = createAsyncThunk(
    'brand/update',
    async (updateData: IAddUpdateBrand, {getState, rejectWithValue}) => {
        try {
            const { brandReducer: { currentBrand } } = getState() as RootState;
            const {data: brandResponse}: AxiosResponse<IBrand> = await axios.put(`/brands/${currentBrand?.id}`, updateData);

            return brandResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteBrandAction = createAsyncThunk(
    'brand/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { brandReducer: { currentBrand } } = getState() as RootState;
            const {data: brandResponse}: AxiosResponse<IBrand> = await axios.delete(`/brands/${currentBrand?.id}`);

            return brandResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);