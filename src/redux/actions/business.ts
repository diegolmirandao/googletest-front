import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IBusiness } from 'src/interfaces/business/business';
import { IAddUpdateBusiness } from 'src/interfaces/business/addUpdate';

export const getBusinessesAction = createAsyncThunk(
    'business/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: businessResponse}: AxiosResponse<IBusiness[]> = await axios.get(`/businesses`);

            return businessResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addBusinessAction = createAsyncThunk(
    'business/add',
    async (addData: IAddUpdateBusiness, {rejectWithValue}) => {
        try {
            const {data: businessResponse}: AxiosResponse<IBusiness> = await axios.post('/businesses', addData);

            return businessResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateBusinessAction = createAsyncThunk(
    'business/update',
    async (updateData: IAddUpdateBusiness, {getState, rejectWithValue}) => {
        try {
            const { businessReducer: { currentBusiness } } = getState() as RootState;
            const {data: businessResponse}: AxiosResponse<IBusiness> = await axios.put(`/businesses/${currentBusiness?.id}`, updateData);

            return businessResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteBusinessAction = createAsyncThunk(
    'business/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { businessReducer: { currentBusiness } } = getState() as RootState;
            const {data: businessResponse}: AxiosResponse<IBusiness> = await axios.delete(`/businesses/${currentBusiness?.id}`);

            return businessResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);