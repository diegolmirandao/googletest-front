import { IAddUpdateCustomerReferenceType } from '../../interfaces/customer/addUpdateReferenceType';
import { ICustomerReferenceType } from 'src/interfaces/customer/referenceType';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getCustomerReferenceTypesAction = createAsyncThunk(
    'customerReferenceType/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: customerReferenceTypeResponse}: AxiosResponse<ICustomerReferenceType[]> = await axios.get(`/customer-reference-types`);

            return customerReferenceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerReferenceTypeAction = createAsyncThunk(
    'customerReferenceType/add',
    async (addData: IAddUpdateCustomerReferenceType, {rejectWithValue}) => {
        try {
            const {data: customerReferenceTypeResponse}: AxiosResponse<ICustomerReferenceType> = await axios.post('/customer-reference-types', addData);

            return customerReferenceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerReferenceTypeAction = createAsyncThunk(
    'customerReferenceType/update',
    async (updateData: IAddUpdateCustomerReferenceType, {getState, rejectWithValue}) => {
        try {
            const { customerReferenceTypeReducer: { currentCustomerReferenceType } } = getState() as RootState;
            const {data: customerReferenceTypeResponse}: AxiosResponse<ICustomerReferenceType> = await axios.put(`/customer-reference-types/${currentCustomerReferenceType?.id}`, updateData);

            return customerReferenceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerReferenceTypeAction = createAsyncThunk(
    'customerReferenceType/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerReferenceTypeReducer: { currentCustomerReferenceType } } = getState() as RootState;
            const {data: customerReferenceTypeResponse}: AxiosResponse<ICustomerReferenceType> = await axios.delete(`/customer-reference-types/${currentCustomerReferenceType?.id}`);

            return customerReferenceTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);