import { IUser } from './../../interfaces/user/user';
import { IUserAuthState } from '../../interfaces/user/redux/userAuthState';
import { createSlice } from '@reduxjs/toolkit'
import { loginAction, logoutAction } from '../actions/auth'
import { MUser } from '../../models/user/user';

const initialState: IUserAuthState = {
    user: null,
    deviceId: null
}

const slice = createSlice({
    initialState,
    name: 'userAuth',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.user = new MUser(action.payload.user as IUser)
            state.deviceId = action.payload.deviceId
        })

        builder.addCase(logoutAction.fulfilled, (state) => {
            state.user = null
            state.deviceId = null
        })
    },
})

export default slice