import { IAddUpdateCurrency } from 'src/interfaces/currency/addUpdate';
import { ICurrency } from 'src/interfaces/currency/currency';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getCurrenciesAction = createAsyncThunk(
    'currency/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: currencyResponse}: AxiosResponse<ICurrency[]> = await axios.get(`/currencies`);

            return currencyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCurrencyAction = createAsyncThunk(
    'currency/add',
    async (addData: IAddUpdateCurrency, {rejectWithValue}) => {
        try {
            const {data: currencyResponse}: AxiosResponse<ICurrency> = await axios.post('/currencies', addData);

            return currencyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCurrencyAction = createAsyncThunk(
    'currency/update',
    async (updateData: IAddUpdateCurrency, {getState, rejectWithValue}) => {
        try {
            const { currencyReducer: { currentCurrency } } = getState() as RootState;
            const {data: currencyResponse}: AxiosResponse<ICurrency> = await axios.put(`/currencies/${currentCurrency?.id}`, updateData);

            return currencyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCurrencyAction = createAsyncThunk(
    'currency/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { currencyReducer: { currentCurrency } } = getState() as RootState;
            const {data: currencyResponse}: AxiosResponse<ICurrency> = await axios.delete(`/currencies/${currentCurrency?.id}`);

            return currencyResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);