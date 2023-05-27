import { IUpdateVariant } from '../../interfaces/product/updateVariant';
import { IVariant } from 'src/interfaces/product/variant';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateVariantOption } from 'src/interfaces/product/addUpdateVariantOption';
import { IAddVariant } from 'src/interfaces/product/addVariant';

export const getVariantsAction = createAsyncThunk(
    'variant/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: variantResponse}: AxiosResponse<IVariant[]> = await axios.get(`/variants`);

            return variantResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addVariantAction = createAsyncThunk(
    'variant/add',
    async (addData: IAddVariant, {rejectWithValue}) => {
        try {
            const {data: variantResponse}: AxiosResponse<IVariant> = await axios.post('/variants', addData);

            return variantResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateVariantAction = createAsyncThunk(
    'variant/update',
    async (updateData: IUpdateVariant, {getState, rejectWithValue}) => {
        try {
            const { variantReducer: { currentVariant } } = getState() as RootState;
            const {data: variantResponse}: AxiosResponse<IVariant> = await axios.put(`/variants/${currentVariant?.id}`, updateData);

            return variantResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addVariantOptionAction = createAsyncThunk(
    'variantOption/add',
    async (addData: IAddUpdateVariantOption, {getState, rejectWithValue}) => {
        try {
            const { variantReducer: { currentVariant } } = getState() as RootState;
            const {data: variantOptionResponse}: AxiosResponse<IVariant> = await axios.post(`/variants/${currentVariant?.id}/options/`, addData);

            return variantOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateVariantOptionAction = createAsyncThunk(
    'variantOption/update',
    async (updateData: IAddUpdateVariantOption, {getState, rejectWithValue}) => {
        try {
            const { variantReducer: { currentVariant, currentVariantOption } } = getState() as RootState;
            const {data: variantOptionResponse}: AxiosResponse<IVariant> = await axios.put(`/variants/${currentVariant?.id}/options/${currentVariantOption?.id}`, updateData);

            return variantOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteVariantOptionAction = createAsyncThunk(
    'variantOption/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { variantReducer: { currentVariant, currentVariantOption } } = getState() as RootState;
            const {data: variantOptionResponse}: AxiosResponse<IVariant> = await axios.delete(`/variants/${currentVariant?.id}/options/${currentVariantOption?.id}`);

            return variantOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteVariantAction = createAsyncThunk(
    'variant/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { variantReducer: { currentVariant } } = getState() as RootState;
            const {data: variantResponse}: AxiosResponse<IVariant> = await axios.delete(`/variants/${currentVariant?.id}`);

            return variantResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);