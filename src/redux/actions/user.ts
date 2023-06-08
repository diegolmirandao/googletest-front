import { IListQueryParam } from './../../interfaces/listQueryParam';
import { IAddUser } from '../../interfaces/user/add';
import { IUpdateUser } from '../../interfaces/user/update';
import { IUser } from '../../interfaces/user/user';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from '../../config/axios';
import { IResponseCursorPagination } from '../../interfaces/responseCursorPagination';
import { RootState } from '..';
import requestParamConfig from 'src/config/requestParam';

export const getUsersAction = createAsyncThunk(
    'user/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { userReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: userResponse}: AxiosResponse<IResponseCursorPagination<IUser>> = await axios.get(`/users`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['users'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const showUserAction = createAsyncThunk(
    'user/show',
    async (id: number, {rejectWithValue}) => {
        try {
            const {data: userResponse}: AxiosResponse<IUser> = await axios.get(`/users/${id}`);

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addUserAction = createAsyncThunk(
    'user/add',
    async (addData: IAddUser, {rejectWithValue}) => {
        try {
            const {data: userResponse}: AxiosResponse<IUser> = await axios.post('/users', addData);

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateUserAction = createAsyncThunk(
    'user/update',
    async (updateData: IUpdateUser, {getState, rejectWithValue}) => {
        try {
            const { userReducer: { currentUser } } = getState() as RootState;
            const {data: userResponse}: AxiosResponse<IUser> = await axios.put(`/users/${currentUser?.id}`, updateData);

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteUserAction = createAsyncThunk(
    'user/delete',
    async (_, {getState, rejectWithValue}) => {
        try {
            const { userReducer: { currentUser } } = getState() as RootState;
            const {data: userResponse}: AxiosResponse<number> = await axios.delete(`/api/users/${currentUser?.id}`);

            return userResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);