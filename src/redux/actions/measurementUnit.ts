import { IAddUpdateMeasurementUnit } from '../../interfaces/product/addUpdateMeasurementUnit';
import { IMeasurementUnit } from 'src/interfaces/product/measurementUnit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getMeasurementUnitsAction = createAsyncThunk(
    'measurementUnit/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: measurementUnitResponse}: AxiosResponse<IMeasurementUnit[]> = await axios.get(`/measurement-units`);

            return measurementUnitResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addMeasurementUnitAction = createAsyncThunk(
    'measurementUnit/add',
    async (addData: IAddUpdateMeasurementUnit, {rejectWithValue}) => {
        try {
            const {data: measurementUnitResponse}: AxiosResponse<IMeasurementUnit> = await axios.post('/measurement-units', addData);

            return measurementUnitResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateMeasurementUnitAction = createAsyncThunk(
    'measurementUnit/update',
    async (updateData: IAddUpdateMeasurementUnit, {getState, rejectWithValue}) => {
        try {
            const { measurementUnitReducer: { currentMeasurementUnit } } = getState() as RootState;
            const {data: measurementUnitResponse}: AxiosResponse<IMeasurementUnit> = await axios.put(`/measurement-units/${currentMeasurementUnit?.id}`, updateData);

            return measurementUnitResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteMeasurementUnitAction = createAsyncThunk(
    'measurementUnit/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { measurementUnitReducer: { currentMeasurementUnit } } = getState() as RootState;
            const {data: measurementUnitResponse}: AxiosResponse<IMeasurementUnit> = await axios.delete(`/measurement-units/${currentMeasurementUnit?.id}`);

            return measurementUnitResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);