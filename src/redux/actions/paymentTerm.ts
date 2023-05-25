import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IPaymentTerm } from 'src/interfaces/payment-term/paymentTerm';
import { IAddUpdatePaymentTerm } from 'src/interfaces/payment-term/addUpdate';

export const getPaymentTermsAction = createAsyncThunk(
    'paymentTerm/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: paymentTermResponse}: AxiosResponse<IPaymentTerm[]> = await axios.get(`/payment-terms`);

            return paymentTermResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPaymentTermAction = createAsyncThunk(
    'paymentTerm/add',
    async (addData: IAddUpdatePaymentTerm, {rejectWithValue}) => {
        try {
            const {data: paymentTermResponse}: AxiosResponse<IPaymentTerm> = await axios.post('/payment-terms', addData);

            return paymentTermResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePaymentTermAction = createAsyncThunk(
    'paymentTerm/update',
    async (updateData: IAddUpdatePaymentTerm, {getState, rejectWithValue}) => {
        try {
            const { paymentTermReducer: { currentPaymentTerm } } = getState() as RootState;
            const {data: paymentTermResponse}: AxiosResponse<IPaymentTerm> = await axios.put(`/payment-terms/${currentPaymentTerm?.id}`, updateData);

            return paymentTermResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePaymentTermAction = createAsyncThunk(
    'paymentTerm/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { paymentTermReducer: { currentPaymentTerm } } = getState() as RootState;
            const {data: paymentTermResponse}: AxiosResponse<IPaymentTerm> = await axios.delete(`/payment-terms/${currentPaymentTerm?.id}`);

            return paymentTermResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);