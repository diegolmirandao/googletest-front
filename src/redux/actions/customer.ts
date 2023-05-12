import { ICustomer } from 'src/interfaces/customer/customer';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateCustomerReference } from 'src/interfaces/customer/addUpdateReference';
import { IAddCustomer } from 'src/interfaces/customer/add';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IAddUpdateCustomerBillingAddress } from 'src/interfaces/customer/addUpdateBillingAddress';
import { IAddUpdateCustomerAddress } from 'src/interfaces/customer/addUpdateAddress';
import { IUpdateCustomer } from 'src/interfaces/customer/update';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';

export const getCustomersAction = createAsyncThunk(
    'customer/get',
    async (params: IListQueryParam, {rejectWithValue}) => {
        try {
            const {data: userResponse}: AxiosResponse<IResponseCursorPagination<ICustomer>> = await axios.get(`/customers`, {
                params: {
                    cursor: params.cursor,
                    page_size: params.pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerAction = createAsyncThunk(
    'customer/add',
    async (addData: IAddCustomer, {rejectWithValue}) => {
        try {
            const {data: customerResponse}: AxiosResponse<ICustomer> = await axios.post('/customers', addData);

            return customerResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerAction = createAsyncThunk(
    'customer/update',
    async (updateData: IUpdateCustomer, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer } } = getState() as RootState;
            const {data: customerResponse}: AxiosResponse<ICustomer> = await axios.put(`/customers/${currentCustomer?.id}`, updateData);

            return customerResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerBillingAddressAction = createAsyncThunk(
    'customerBillingAddress/add',
    async (addData: IAddUpdateCustomerBillingAddress, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer } } = getState() as RootState;
            const {data: customerBillingAddressResponse}: AxiosResponse<ICustomer> = await axios.post(`/customers/${currentCustomer?.id}/billing-addresses/`, addData);

            return customerBillingAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerBillingAddressAction = createAsyncThunk(
    'customerBillingAddress/update',
    async (updateData: IAddUpdateCustomerBillingAddress, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerBillingAddress } } = getState() as RootState;
            const {data: customerBillingAddressResponse}: AxiosResponse<ICustomer> = await axios.put(`/customers/${currentCustomer?.id}/billing-addresses/${currentCustomerBillingAddress?.id}`, updateData);

            return customerBillingAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerBillingAddressAction = createAsyncThunk(
    'customerBillingAddress/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerBillingAddress } } = getState() as RootState;
            const {data: customerBillingAddressResponse}: AxiosResponse<ICustomer> = await axios.delete(`/customers/${currentCustomer?.id}/billing-addresses/${currentCustomerBillingAddress?.id}`);

            return customerBillingAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerReferenceAction = createAsyncThunk(
    'customerReference/add',
    async (addData: IAddUpdateCustomerReference, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer } } = getState() as RootState;
            const {data: customerReferenceResponse}: AxiosResponse<ICustomer> = await axios.post(`/customers/${currentCustomer?.id}/references/`, addData);

            return customerReferenceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerReferenceAction = createAsyncThunk(
    'customerReference/update',
    async (updateData: IAddUpdateCustomerReference, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerReference } } = getState() as RootState;
            const {data: customerReferenceResponse}: AxiosResponse<ICustomer> = await axios.put(`/customers/${currentCustomer?.id}/references/${currentCustomerReference?.id}`, updateData);

            return customerReferenceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerReferenceAction = createAsyncThunk(
    'customerReference/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerReference } } = getState() as RootState;
            const {data: customerReferenceResponse}: AxiosResponse<ICustomer> = await axios.delete(`/customers/${currentCustomer?.id}/references/${currentCustomerReference?.id}`);

            return customerReferenceResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerAddressAction = createAsyncThunk(
    'customerAddress/add',
    async (addData: IAddUpdateCustomerAddress, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer } } = getState() as RootState;
            const {data: customerAddressResponse}: AxiosResponse<ICustomer> = await axios.post(`/customers/${currentCustomer?.id}/addresses/`, addData);

            return customerAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerAddressAction = createAsyncThunk(
    'customerAddress/update',
    async (updateData: IAddUpdateCustomerAddress, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerAddress } } = getState() as RootState;
            const {data: customerAddressResponse}: AxiosResponse<ICustomer> = await axios.put(`/customers/${currentCustomer?.id}/addresses/${currentCustomerAddress?.id}`, updateData);

            return customerAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerAddressAction = createAsyncThunk(
    'customerAddress/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer, currentCustomerAddress } } = getState() as RootState;
            const {data: customerAddressResponse}: AxiosResponse<ICustomer> = await axios.delete(`/customers/${currentCustomer?.id}/addresses/${currentCustomerAddress?.id}`);

            return customerAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerAction = createAsyncThunk(
    'customer/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerReducer: { currentCustomer } } = getState() as RootState;
            const {data: customerResponse}: AxiosResponse<ICustomer> = await axios.delete(`/customers/${currentCustomer?.id}`);

            return customerResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);