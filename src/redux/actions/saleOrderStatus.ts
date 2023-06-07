import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { ISaleOrderStatus } from 'src/interfaces/sale-order/status';

export const getSaleOrderStatusesAction = createAsyncThunk(
    'saleOrderStatus/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: saleOrderStatusResponse}: AxiosResponse<ISaleOrderStatus[]> = await axios.get(`/sale-order-statuses`);

            return saleOrderStatusResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);