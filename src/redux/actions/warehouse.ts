import { IAddUpdateWarehouse } from '../../interfaces/warehouse/addUpdate';
import { IWarehouse } from 'src/interfaces/warehouse/warehouse';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getWarehousesAction = createAsyncThunk(
    'warehouse/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: warehouseResponse}: AxiosResponse<IWarehouse[]> = await axios.get(`/warehouses`);

            return warehouseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addWarehouseAction = createAsyncThunk(
    'warehouse/add',
    async (addData: IAddUpdateWarehouse, {rejectWithValue}) => {
        try {
            const {data: warehouseResponse}: AxiosResponse<IWarehouse> = await axios.post('/warehouses', addData);

            return warehouseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateWarehouseAction = createAsyncThunk(
    'warehouse/update',
    async (updateData: IAddUpdateWarehouse, {getState, rejectWithValue}) => {
        try {
            const { warehouseReducer: { currentWarehouse } } = getState() as RootState;
            const {data: warehouseResponse}: AxiosResponse<IWarehouse> = await axios.put(`/warehouses/${currentWarehouse?.id}`, updateData);

            return warehouseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteWarehouseAction = createAsyncThunk(
    'warehouse/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { warehouseReducer: { currentWarehouse } } = getState() as RootState;
            const {data: warehouseResponse}: AxiosResponse<IWarehouse> = await axios.delete(`/warehouses/${currentWarehouse?.id}`);

            return warehouseResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);