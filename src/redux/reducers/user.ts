import { IUserState } from '../../interfaces/user/redux/userState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getUsersAction, addUserAction, updateUserAction, deleteUserAction, showUserAction } from '../actions/user'
import { MUser } from '../../models/user/user';
import { IUser } from 'src/interfaces/user/user';

const initialState: IUserState = {
    users: [],
    filteredUsers: null,
    cursor: null,
    filteredCursor: null,
    currentUser: undefined
}

const slice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        resetFilteredUsers(state) {
            state.filteredUsers = null;
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setCursor(state, action) {
            state.cursor = action.payload
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getUsersAction.fulfilled, (state, action) => {
            const params = action.meta.arg
            const users = action.payload.data.map((user) => new MUser(user));

            if (params.filters || (JSON.stringify(params.sorts) !== JSON.stringify({'f_params[orderBy][field]': "created_at", 'f_params[orderBy][type]': "desc"}))) {
                state.filteredUsers = users;
                state.filteredCursor = action.payload.next_cursor;
            } else {
                state.users = state.users.length && state.cursor ? [...state.users, ...users] : users;
                state.cursor = action.payload.next_cursor;
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
            const user = new MUser(action.payload);
            const updatePayload = new MUser(action.payload);
            state.users = state.users.map(user => user.id == updatePayload.id ? updatePayload : user);
            state.filteredUsers = state.filteredUsers ? [user, ...state.filteredUsers] : null;
            state.currentUser = updatePayload;
        })
        builder.addCase(deleteUserAction.fulfilled, (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        })
        builder.addCase(createAction<IUser[]>('user/sync'), (state, action) => {
            const syncUsers = action.payload.map((user) => new MUser(user));

            if (state.users.length) {
                syncUsers.forEach((syncUser, index) => {
                    if (state.users.find(user => user.id == syncUser.id)) {
                        state.users = state.users.map(user => user.id == syncUser.id ? syncUser : user);
                        syncUsers.splice(index, 1);
                    }
                });
                
                state.users = [...state.users, ...syncUsers]
            } else {
                state.users = syncUsers
            }
        })
    },
})

export const { resetFilteredUsers, setFilteredCursor, setCursor, setCurrentUser } = slice.actions

export default slice