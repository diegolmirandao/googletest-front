import ISyncState from 'src/interfaces/syncState';
import { createSlice } from '@reduxjs/toolkit'

const initialState: ISyncState = {
    syncDone: false
}

const slice = createSlice({
    initialState,
    name: 'sync',
    reducers: {
        syncEnded(state) {
            state.syncDone = true
        },
        resetSync(state) {
            state.syncDone = false
        }
    },
})

export const { syncEnded, resetSync } = slice.actions

export default slice