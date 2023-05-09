import ITableState from 'src/interfaces/user/redux/tableState';
import { createSlice } from '@reduxjs/toolkit'

const initialState: ITableState = {
    users: {
        visibility: {
            id: false,
            name: true,
            username: true,
            email: true,
            role: true,
            status: true,
            createdAt: false,
            updatedAt: false,
        },
        filters: undefined,
        sorts: {
            'f_params[orderBy][field]': 'created_at',
            'f_params[orderBy][type]': 'desc',
        },
        export: null,
    }
}

const slice = createSlice({
    initialState,
    name: 'table',
    reducers: {
        setUserVisibility(state, action) {
            state.users.visibility = action.payload
        },
        setUserFilters(state, action) {
            state.users.filters = action.payload
        },
        setUserSorts(state, action) {
            state.users.sorts = action.payload
        },
        setUserExport(state, action) {
            state.users.export = action.payload
        }
    },
})

export const { setUserVisibility, setUserFilters, setUserSorts, setUserExport } = slice.actions

export default slice