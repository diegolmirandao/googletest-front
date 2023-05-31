import { createSlice } from '@reduxjs/toolkit';
import { MSale } from 'src/models/sale/sale';
import { getAccountsReceivableAction } from '../actions/accountReceivable';
import { IAccountReceivableState } from 'src/interfaces/sale/redux/accountReceivableState';

const initialState: IAccountReceivableState = {
    accountsReceivable: [],
    filteredAccountsReceivable: null,
    cursor: null,
    filteredCursor: null
}

const slice = createSlice({
    initialState,
    name: 'accountReceivable',
    reducers: {
        resetFilteredAccountsReceivable(state) {
            state.filteredAccountsReceivable = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAccountsReceivableAction.fulfilled, (state, action) => {
            const accounts = action.payload.data.map((account) => new MSale(account));
            state.accountsReceivable = accounts
        })
    },
})

export const { resetFilteredAccountsReceivable, setCursor, setFilteredCursor } = slice.actions

export default slice