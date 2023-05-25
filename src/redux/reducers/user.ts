import { IUserState } from '../../interfaces/user/redux/userState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getUsersAction, addUserAction, updateUserAction, deleteUserAction, showUserAction } from '../actions/user'
import { MUser } from '../../models/user/user';
import { IUser } from 'src/interfaces/user/user';

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
        builder.addCase(showUserAction.fulfilled, (state, action) => {
            const receivedUser = new MUser(action.payload);
            const existingUser = state.users.find(user => user.id == receivedUser.id);
            if (existingUser) {
                state.users = state.users.map(user => user.id == receivedUser.id ? receivedUser : user);
            } else {
                state.users = [receivedUser, ...state.users];
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
        builder.addCase(createAction<IUser[]>('user/sync'), (state, action) => {
            const users = action.payload.map((user) => new MUser(user));
            state.users = state.users.length ? [...state.users, ...users] : users
        })
    },
})

export const { setCursor, setCurrentUser } = slice.actions

export default slice