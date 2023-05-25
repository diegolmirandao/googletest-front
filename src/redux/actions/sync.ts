import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import ISync from 'src/interfaces/sync';

export const syncAction = createAsyncThunk(
    'sync/get',
    async (deviceId: string, {rejectWithValue}) => {
        try {
            const {data: response}: AxiosResponse<IResponseCursorPagination<ISync>> = await axios.get('/sync/'+deviceId);

            return response;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);