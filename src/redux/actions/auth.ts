import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from '../../config/axios';
import { ILogin } from '../../interfaces/user/login';
import IAuthResponse from 'src/interfaces/authResponse';

export const loginAction = createAsyncThunk(
    'user/login',
    async (login: ILogin, {rejectWithValue}) => {
        try {
            let {username, password} = login;
            username = username.trim();
            password = password.trim();

            const body = {
                username: username,
                password
            };

            await axios.get('/sanctum/csrf-cookie');

            const {data: userResponse}: AxiosResponse<IAuthResponse> = await axios.post('/login', body);

            return userResponse;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logoutAction = createAsyncThunk(
    'user/logout',
    async (params: undefined, {rejectWithValue}) => {
        try {
            const userResponse = await axios.get('/logout');

            return userResponse;   
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);