import { ICurrencyState } from '../../interfaces/currency/redux/currencyState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getCurrenciesAction, addCurrencyAction, updateCurrencyAction, deleteCurrencyAction } from '../actions/currency'
import { MCurrency } from 'src/models/currency';
import { ICurrency } from 'src/interfaces/currency/currency';

const initialState: ICurrencyState = {
    currencies: [],
    currentCurrency: undefined
}

const slice = createSlice({
    initialState,
    name: 'currency',
    reducers: {
        setCurrentCurrency(state, action) {
            state.currentCurrency = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<ICurrency[]>('currency/get'), (state, action) => {
            const currencies = action.payload.map((currency) => new MCurrency(currency));
            state.currencies = currencies;
        })
        builder.addCase(getCurrenciesAction.fulfilled, (state, action) => {
            const currencies = action.payload.map((currency) => new MCurrency(currency));
            state.currencies = currencies
        })
        builder.addCase(addCurrencyAction.fulfilled, (state, action) => {
            const currency = new MCurrency(action.payload);
            state.currencies = [currency, ...state.currencies];
            state.currentCurrency = currency;
        })
        builder.addCase(updateCurrencyAction.fulfilled, (state, action) => {
            const updatePayload = new MCurrency(action.payload);
            state.currencies = state.currencies.map(currency => currency.id == updatePayload.id ? updatePayload : currency);
            state.currentCurrency = updatePayload;
        })
        builder.addCase(deleteCurrencyAction.fulfilled, (state, action) => {
            const deletePayload = new MCurrency(action.payload);
            state.currencies = state.currencies.filter(currency => currency.id !== deletePayload.id);
        })
    },
})

export const { setCurrentCurrency } = slice.actions

export default slice