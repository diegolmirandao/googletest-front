import { IUserState } from '../../interfaces/user/redux/userState';
import { createSlice } from '@reduxjs/toolkit'
import { getUsersAction, addUserAction, updateUserAction, deleteUserAction } from '../actions/user'
import { MUser } from '../../models/user/user';

const initialState: IUserState = {
    users: [],
    filteredUsers: null,
    cursor: null,
    currentUser: undefined
}

const slice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setCursor(state, action) {
            state.cursor = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getUsersAction.fulfilled, (state, action) => {
            const params = action.meta.arg
            const users = action.payload.data.map((user) => new MUser(user));

            if (params.filters) {
                state.filteredUsers = users
            } else {
                state.users = state.users.length ? [...state.users, ...users] : users
            }
        })
        builder.addCase(addUserAction.fulfilled, (state, action) => {
            const user = new MUser(action.payload);
            state.users = [user, ...state.users];
            state.currentUser = user;
        })
        builder.addCase(updateUserAction.fulfilled, (state, action) => {
            const updatePayload = new MUser(action.payload);
            state.users = state.users.map(user => user.id == updatePayload.id ? updatePayload : user);
            state.currentUser = updatePayload;
        })
        builder.addCase(deleteUserAction.fulfilled, (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        })
    },
})

export const { setCursor, setCurrentUser } = slice.actions

export default slice