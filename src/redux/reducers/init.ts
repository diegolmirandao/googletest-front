import IInitState from 'src/interfaces/initState';
import { createSlice } from '@reduxjs/toolkit'

const initialState: IInitState = {
    initDone: false
}

const slice = createSlice({
    initialState,
    name: 'init',
    reducers: {
        initEnded(state) {
            state.initDone = true
        }
    },
})

export const { initEnded } = slice.actions

export default slice