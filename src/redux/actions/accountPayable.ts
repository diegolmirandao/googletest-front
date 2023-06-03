import { IPurchase } from 'src/interfaces/purchase/purchase';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';

export const getAccountsPayableAction = createAsyncThunk(
    'accountPayable/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: response}: AxiosResponse<IResponseCursorPagination<IPurchase>> = await axios.get(`/accounts-payable`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['accountsPayable'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return response;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);