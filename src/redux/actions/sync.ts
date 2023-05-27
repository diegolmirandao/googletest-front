import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import ISync from 'src/interfaces/sync';
import { ISyncParam } from 'src/interfaces/syncParam';

export const syncAction = createAsyncThunk(
    'sync/get',
    async (params: ISyncParam, {rejectWithValue}) => {
        try {
            const {data: response}: AxiosResponse<IResponseCursorPagination<ISync>> = await axios.get('/sync/'+params.deviceId, {
                params: {
                    cursor: params.cursor
                }
            });

            return response;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);