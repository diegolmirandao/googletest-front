import { IUpdateEstablishment } from '../../interfaces/establishment/update';
import { IEstablishment } from 'src/interfaces/establishment/establishment';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdatePointOfSale } from 'src/interfaces/establishment/addUpdatePointOfSale';
import { IAddEstablishment } from 'src/interfaces/establishment/add';

export const getEstablishmentsAction = createAsyncThunk(
    'establishment/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: establishmentResponse}: AxiosResponse<IEstablishment[]> = await axios.get(`/establishments`);

            return establishmentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addEstablishmentAction = createAsyncThunk(
    'establishment/add',
    async (addData: IAddEstablishment, {rejectWithValue}) => {
        try {
            const {data: establishmentResponse}: AxiosResponse<IEstablishment> = await axios.post('/establishments', addData);

            return establishmentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateEstablishmentAction = createAsyncThunk(
    'establishment/update',
    async (updateData: IUpdateEstablishment, {getState, rejectWithValue}) => {
        try {
            const { establishmentReducer: { currentEstablishment } } = getState() as RootState;
            const {data: establishmentResponse}: AxiosResponse<IEstablishment> = await axios.put(`/establishments/${currentEstablishment?.id}`, updateData);

            return establishmentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPointOfSaleAction = createAsyncThunk(
    'pointOfSale/add',
    async (addData: IAddUpdatePointOfSale, {getState, rejectWithValue}) => {
        try {
            const { establishmentReducer: { currentEstablishment } } = getState() as RootState;
            const {data: pointOfSaleResponse}: AxiosResponse<IEstablishment> = await axios.post(`/establishments/${currentEstablishment?.id}/points-of-sale/`, addData);

            return pointOfSaleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePointOfSaleAction = createAsyncThunk(
    'pointOfSale/update',
    async (updateData: IAddUpdatePointOfSale, {getState, rejectWithValue}) => {
        try {
            const { establishmentReducer: { currentEstablishment, currentPointOfSale } } = getState() as RootState;
            const {data: pointOfSaleResponse}: AxiosResponse<IEstablishment> = await axios.put(`/establishments/${currentEstablishment?.id}/points-of-sale/${currentPointOfSale?.id}`, updateData);

            return pointOfSaleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePointOfSaleAction = createAsyncThunk(
    'pointOfSale/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { establishmentReducer: { currentEstablishment, currentPointOfSale } } = getState() as RootState;
            const {data: pointOfSaleResponse}: AxiosResponse<IEstablishment> = await axios.delete(`/establishments/${currentEstablishment?.id}/points-of-sale/${currentPointOfSale?.id}`);

            return pointOfSaleResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteEstablishmentAction = createAsyncThunk(
    'establishment/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { establishmentReducer: { currentEstablishment } } = getState() as RootState;
            const {data: establishmentResponse}: AxiosResponse<IEstablishment> = await axios.delete(`/establishments/${currentEstablishment?.id}`);

            return establishmentResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);