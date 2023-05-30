import { createSlice } from '@reduxjs/toolkit';
import { MSale } from 'src/models/sale/sale';
import { getAccountsAction } from '../actions/accountReceivable';
import { IAccountReceivableState } from 'src/interfaces/sale/redux/accountReceivableState';

const initialState: IAccountReceivableState = {
    accounts: [],
    filteredAccounts: null,
    cursor: null,
    filteredCursor: null
}

const slice = createSlice({
    initialState,
    name: 'accountReceivable',
    reducers: {
        resetFilteredAccounts(state) {
            state.filteredAccounts = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAccountsAction.fulfilled, (state, action) => {
            const accounts = action.payload.data.map((account) => new MSale(account));
            state.accounts = accounts
        })
    },
})

export const { resetFilteredAccounts, setCursor, setFilteredCursor } = slice.actions

export default slice