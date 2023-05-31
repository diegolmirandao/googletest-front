import { ISupplier } from 'src/interfaces/supplier/supplier';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateSupplierContact } from 'src/interfaces/supplier/addUpdateContact';
import { IAddSupplier } from 'src/interfaces/supplier/add';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IAddUpdateSupplierAddress } from 'src/interfaces/supplier/addUpdateAddress';
import { IUpdateSupplier } from 'src/interfaces/supplier/update';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';

export const getSuppliersAction = createAsyncThunk(
    'supplier/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: supplierResponse}: AxiosResponse<IResponseCursorPagination<ISupplier>> = await axios.get(`/suppliers`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['suppliers'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const showSupplierAction = createAsyncThunk(
    'supplier/show',
    async (id: number, {rejectWithValue}) => {
        try {
            const {data: supplierResponse}: AxiosResponse<ISupplier> = await axios.get(`/suppliers/${id}`);

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSupplierAction = createAsyncThunk(
    'supplier/add',
    async (addData: IAddSupplier, {rejectWithValue}) => {
        try {
            const {data: supplierResponse}: AxiosResponse<ISupplier> = await axios.post('/suppliers', addData);

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSupplierAction = createAsyncThunk(
    'supplier/update',
    async (updateData: IUpdateSupplier, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier } } = getState() as RootState;
            const {data: supplierResponse}: AxiosResponse<ISupplier> = await axios.put(`/suppliers/${currentSupplier?.id}`, updateData);

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSupplierContactAction = createAsyncThunk(
    'supplierContact/add',
    async (addData: IAddUpdateSupplierContact, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier } } = getState() as RootState;
            const {data: supplierContactResponse}: AxiosResponse<ISupplier> = await axios.post(`/suppliers/${currentSupplier?.id}/contacts/`, addData);

            return supplierContactResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSupplierContactAction = createAsyncThunk(
    'supplierContact/update',
    async (updateData: IAddUpdateSupplierContact, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier, currentSupplierContact } } = getState() as RootState;
            const {data: supplierContactResponse}: AxiosResponse<ISupplier> = await axios.put(`/suppliers/${currentSupplier?.id}/contacts/${currentSupplierContact?.id}`, updateData);

            return supplierContactResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSupplierContactAction = createAsyncThunk(
    'supplierContact/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier, currentSupplierContact } } = getState() as RootState;
            const {data: supplierContactResponse}: AxiosResponse<ISupplier> = await axios.delete(`/suppliers/${currentSupplier?.id}/contacts/${currentSupplierContact?.id}`);

            return supplierContactResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addSupplierAddressAction = createAsyncThunk(
    'supplierAddress/add',
    async (addData: IAddUpdateSupplierAddress, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier } } = getState() as RootState;
            const {data: supplierAddressResponse}: AxiosResponse<ISupplier> = await axios.post(`/suppliers/${currentSupplier?.id}/addresses/`, addData);

            return supplierAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateSupplierAddressAction = createAsyncThunk(
    'supplierAddress/update',
    async (updateData: IAddUpdateSupplierAddress, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier, currentSupplierAddress } } = getState() as RootState;
            const {data: supplierAddressResponse}: AxiosResponse<ISupplier> = await axios.put(`/suppliers/${currentSupplier?.id}/addresses/${currentSupplierAddress?.id}`, updateData);

            return supplierAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSupplierAddressAction = createAsyncThunk(
    'supplierAddress/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier, currentSupplierAddress } } = getState() as RootState;
            const {data: supplierAddressResponse}: AxiosResponse<ISupplier> = await axios.delete(`/suppliers/${currentSupplier?.id}/addresses/${currentSupplierAddress?.id}`);

            return supplierAddressResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteSupplierAction = createAsyncThunk(
    'supplier/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { supplierReducer: { currentSupplier } } = getState() as RootState;
            const {data: supplierResponse}: AxiosResponse<ISupplier> = await axios.delete(`/suppliers/${currentSupplier?.id}`);

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);