import ISyncState from 'src/interfaces/syncState';
import { createSlice } from '@reduxjs/toolkit'

const initialState: ISyncState = {
    syncStarted: false,
    syncDone: false
}

const slice = createSlice({
    initialState,
    name: 'sync',
    reducers: {
        setSyncStarted(state, action) {
            state.syncStarted = action.payload
        },
        syncEnded(state) {
            state.syncDone = true
        },
        resetSync(state) {
            state.syncDone = false
        }
    },
})

export const { syncEnded, resetSync, setSyncStarted } = slice.actions

export default slice