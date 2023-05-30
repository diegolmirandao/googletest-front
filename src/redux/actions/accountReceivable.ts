import { ISale } from 'src/interfaces/sale/sale';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';

export const getAccountsAction = createAsyncThunk(
    'accountReceivable/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { saleReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: customerResponse}: AxiosResponse<IResponseCursorPagination<ISale>> = await axios.get(`/accounts-receivable`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['accountsReceivable'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return customerResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);