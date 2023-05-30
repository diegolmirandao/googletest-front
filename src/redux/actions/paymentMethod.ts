import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IPaymentMethod } from 'src/interfaces/payment-method/paymentMethod';
import { IAddUpdatePaymentMethod } from 'src/interfaces/payment-method/addUpdate';

export const getPaymentMethodsAction = createAsyncThunk(
    'paymentMethod/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: paymentMethodResponse}: AxiosResponse<IPaymentMethod[]> = await axios.get(`/payment-methods`);

            return paymentMethodResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addPaymentMethodAction = createAsyncThunk(
    'paymentMethod/add',
    async (addData: IAddUpdatePaymentMethod, {rejectWithValue}) => {
        try {
            const {data: paymentMethodResponse}: AxiosResponse<IPaymentMethod> = await axios.post('/payment-methods', addData);

            return paymentMethodResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updatePaymentMethodAction = createAsyncThunk(
    'paymentMethod/update',
    async (updateData: IAddUpdatePaymentMethod, {getState, rejectWithValue}) => {
        try {
            const { paymentMethodReducer: { currentPaymentMethod } } = getState() as RootState;
            const {data: paymentMethodResponse}: AxiosResponse<IPaymentMethod> = await axios.put(`/payment-methods/${currentPaymentMethod?.id}`, updateData);

            return paymentMethodResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deletePaymentMethodAction = createAsyncThunk(
    'paymentMethod/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { paymentMethodReducer: { currentPaymentMethod } } = getState() as RootState;
            const {data: paymentMethodResponse}: AxiosResponse<IPaymentMethod> = await axios.delete(`/payment-methods/${currentPaymentMethod?.id}`);

            return paymentMethodResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);