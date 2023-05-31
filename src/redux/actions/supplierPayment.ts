import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IListQueryParam } from 'src/interfaces/listQueryParam';
import { IResponseCursorPagination } from 'src/interfaces/responseCursorPagination';
import requestParamConfig from 'src/config/requestParam';
import { IPurchasePayment } from 'src/interfaces/purchase/payment';

export const getSupplierPaymentsAction = createAsyncThunk(
    'supplierPayment/get',
    async (params: IListQueryParam, {getState, rejectWithValue}) => {
        try {
            const { purchaseReducer: { cursor, filteredCursor } } = getState() as RootState;
            const usedCursor = params.filters || params.sorts ? filteredCursor : cursor;

            const {data: supplierResponse}: AxiosResponse<IResponseCursorPagination<IPurchasePayment>> = await axios.get(`/supplier-payments`, {
                params: {
                    cursor: usedCursor,
                    page_size: requestParamConfig['supplierPayments'].pageSize,
                    ...params.filters,
                    ...params.sorts
                }
            });

            return supplierResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);