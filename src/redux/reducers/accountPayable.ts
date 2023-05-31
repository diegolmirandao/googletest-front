import { createSlice } from '@reduxjs/toolkit';
import { MPurchase } from 'src/models/purchase/purchase';
import { getAccountsPayableAction } from '../actions/accountPayable';
import { IAccountPayableState } from 'src/interfaces/purchase/redux/accountPayableState';

const initialState: IAccountPayableState = {
    accountsPayable: [],
    filteredAccountsPayable: null,
    cursor: null,
    filteredCursor: null
}

const slice = createSlice({
    initialState,
    name: 'accountPayable',
    reducers: {
        resetFilteredAccountsPayable(state) {
            state.filteredAccountsPayable = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAccountsPayableAction.fulfilled, (state, action) => {
            const accounts = action.payload.data.map((account) => new MPurchase(account));
            state.accountsPayable = accounts
        })
    },
})

export const { resetFilteredAccountsPayable, setCursor, setFilteredCursor } = slice.actions

export default slice