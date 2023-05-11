import ITableState from 'src/interfaces/tableState';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ITableState = {
    users: {
        columns: undefined,
        visibility: undefined,
        filters: undefined,
        sorts: undefined,
        export: undefined,
    }
};

const slice = createSlice({
    initialState,
    name: 'table',
    reducers: {
        setUserColumns(state, action) {
            state.users.columns = action.payload;
        },
        setUserVisibility(state, action) {
            state.users.visibility = action.payload;
        },
        setUserFilters(state, action) {
            state.users.filters = action.payload;
        },
        setUserSorts(state, action) {
            state.users.sorts = action.payload;
        },
        setUserExport(state, action) {
            state.users.export = action.payload;
        }
    },
})

export const { setUserColumns, setUserVisibility, setUserFilters, setUserSorts, setUserExport } = slice.actions;

export default slice;