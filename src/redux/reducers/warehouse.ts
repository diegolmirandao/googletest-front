import { IWarehouseState } from '../../interfaces/warehouse/redux/warehouseState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getWarehousesAction, addWarehouseAction, updateWarehouseAction, deleteWarehouseAction } from '../actions/warehouse'
import { MWarehouse } from 'src/models/warehouse';
import { IWarehouse } from 'src/interfaces/warehouse/warehouse';

const initialState: IWarehouseState = {
    warehouses: [],
    currentWarehouse: undefined
}

const slice = createSlice({
    initialState,
    name: 'warehouse',
    reducers: {
        setCurrentWarehouse(state, action) {
            state.currentWarehouse = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IWarehouse[]>('warehouse/get'), (state, action) => {
            const warehouses = action.payload.map((warehouse) => new MWarehouse(warehouse));
            state.warehouses = warehouses;
        })
        builder.addCase(getWarehousesAction.fulfilled, (state, action) => {
            const warehouses = action.payload.map((warehouse) => new MWarehouse(warehouse));
            state.warehouses = warehouses
        })
        builder.addCase(addWarehouseAction.fulfilled, (state, action) => {
            const warehouse = new MWarehouse(action.payload);
            state.warehouses = [warehouse, ...state.warehouses];
            state.currentWarehouse = warehouse;
        })
        builder.addCase(updateWarehouseAction.fulfilled, (state, action) => {
            const updatePayload = new MWarehouse(action.payload);
            state.warehouses = state.warehouses.map(warehouse => warehouse.id == updatePayload.id ? updatePayload : warehouse);
            state.currentWarehouse = updatePayload;
        })
        builder.addCase(deleteWarehouseAction.fulfilled, (state, action) => {
            const deletePayload = new MWarehouse(action.payload);
            state.warehouses = state.warehouses.filter(warehouse => warehouse.id !== deletePayload.id);
        })
    },
})

export const { setCurrentWarehouse } = slice.actions

export default slice