import IInit from 'src/interfaces/init';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';

export const initAction = createAsyncThunk(
    'init/get',
    async (_, {rejectWithValue}) => {
        try {
            const {data: response}: AxiosResponse<IInit> = await axios.get('/init');

            return response;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);