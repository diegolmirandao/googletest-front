import { IMeasurementUnitState } from '../../interfaces/product/redux/measurementUnitState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getMeasurementUnitsAction, addMeasurementUnitAction, updateMeasurementUnitAction, deleteMeasurementUnitAction } from '../actions/measurementUnit'
import { MMeasurementUnit } from 'src/models/product/measurementUnit';
import { IMeasurementUnit } from 'src/interfaces/product/measurementUnit';

const initialState: IMeasurementUnitState = {
    measurementUnits: [],
    currentMeasurementUnit: undefined
}

const slice = createSlice({
    initialState,
    name: 'measurementUnit',
    reducers: {
        setCurrentMeasurementUnit(state, action) {
            state.currentMeasurementUnit = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IMeasurementUnit[]>('measurementUnit/get'), (state, action) => {
            const measurementUnits = action.payload.map((measurementUnit) => new MMeasurementUnit(measurementUnit));
            state.measurementUnits = measurementUnits;
        })
        builder.addCase(getMeasurementUnitsAction.fulfilled, (state, action) => {
            const measurementUnits = action.payload.map((measurementunit) => new MMeasurementUnit(measurementunit));
            state.measurementUnits = measurementUnits;
        })
        builder.addCase(addMeasurementUnitAction.fulfilled, (state, action) => {
            const measurementUnit = new MMeasurementUnit(action.payload);
            state.measurementUnits = [measurementUnit, ...state.measurementUnits];
            state.currentMeasurementUnit = measurementUnit;
        })
        builder.addCase(updateMeasurementUnitAction.fulfilled, (state, action) => {
            const updatePayload = new MMeasurementUnit(action.payload);
            state.measurementUnits = state.measurementUnits.map(measurementUnit => measurementUnit.id == updatePayload.id ? updatePayload : measurementUnit);
            state.currentMeasurementUnit = updatePayload;
        })
        builder.addCase(deleteMeasurementUnitAction.fulfilled, (state, action) => {
            const deletePayload = new MMeasurementUnit(action.payload);
            state.measurementUnits = state.measurementUnits.filter(measurementUnit => measurementUnit.id !== deletePayload.id);
        })
    },
})

export const { setCurrentMeasurementUnit } = slice.actions

export default slice