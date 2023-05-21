import { IUpdateProperty } from '../../interfaces/product/updateProperty';
import { IProperty } from 'src/interfaces/product/property';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdatePropertyOption } from 'src/interfaces/product/addUpdatePropertyOption';
import { IAddProperty } from 'src/interfaces/product/addProperty';

export const getPropertiesAction = createAsyncThunk(
    'property/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: propertyResponse}: AxiosResponse<IProperty[]> = await axios.get(`/properties`);

            return propertyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPropertyAction = createAsyncThunk(
    'property/add',
    async (addData: IAddProperty, {rejectWithValue}) => {
        try {
            const {data: propertyResponse}: AxiosResponse<IProperty> = await axios.post('/properties', addData);

            return propertyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePropertyAction = createAsyncThunk(
    'property/update',
    async (updateData: IUpdateProperty, {getState, rejectWithValue}) => {
        try {
            const { propertyReducer: { currentProperty } } = getState() as RootState;
            const {data: propertyResponse}: AxiosResponse<IProperty> = await axios.put(`/properties/${currentProperty?.id}`, updateData);

            return propertyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPropertyOptionAction = createAsyncThunk(
    'propertyOption/add',
    async (addData: IAddUpdatePropertyOption, {getState, rejectWithValue}) => {
        try {
            const { propertyReducer: { currentProperty } } = getState() as RootState;
            const {data: propertyOptionResponse}: AxiosResponse<IProperty> = await axios.post(`/properties/${currentProperty?.id}/options/`, addData);

            return propertyOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePropertyOptionAction = createAsyncThunk(
    'propertyOption/update',
    async (updateData: IAddUpdatePropertyOption, {getState, rejectWithValue}) => {
        try {
            const { propertyReducer: { currentProperty, currentPropertyOption } } = getState() as RootState;
            const {data: propertyOptionResponse}: AxiosResponse<IProperty> = await axios.put(`/properties/${currentProperty?.id}/options/${currentPropertyOption?.id}`, updateData);

            return propertyOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePropertyOptionAction = createAsyncThunk(
    'propertyOption/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { propertyReducer: { currentProperty, currentPropertyOption } } = getState() as RootState;
            const {data: propertyOptionResponse}: AxiosResponse<IProperty> = await axios.delete(`/properties/${currentProperty?.id}/options/${currentPropertyOption?.id}`);

            return propertyOptionResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePropertyAction = createAsyncThunk(
    'property/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { propertyReducer: { currentProperty } } = getState() as RootState;
            const {data: propertyResponse}: AxiosResponse<IProperty> = await axios.delete(`/properties/${currentProperty?.id}`);

            return propertyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);