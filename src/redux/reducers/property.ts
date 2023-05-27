import { IPropertyState } from '../../interfaces/product/redux/propertyState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getPropertiesAction, addPropertyAction, updatePropertyAction, deletePropertyAction } from '../actions/property';
import { addPropertyOptionAction, updatePropertyOptionAction, deletePropertyOptionAction } from '../actions/property';
import { MProperty } from 'src/models/product/property';
import { IProperty } from 'src/interfaces/product/property';

const initialState: IPropertyState = {
    properties: [],
    currentProperty: undefined,
    currentPropertyOption: undefined
}

const slice = createSlice({
    initialState,
    name: 'property',
    reducers: {
        setCurrentProperty(state, action) {
            state.currentProperty = action.payload
        },
        setCurrentPropertyOption(state, action) {
            state.currentPropertyOption = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IProperty[]>('property/get'), (state, action) => {
            const properties = action.payload.map((property) => new MProperty(property));
            state.properties = properties;
        })
        builder.addCase(getPropertiesAction.fulfilled, (state, action) => {
            const properties = action.payload.map((property) => new MProperty(property));
            state.properties = properties
        })
        builder.addCase(addPropertyAction.fulfilled, (state, action) => {
            const property = new MProperty(action.payload);
            state.properties = [property, ...state.properties];
            state.currentProperty = property;
        })
        builder.addCase(updatePropertyAction.fulfilled, (state, action) => {
            const updatePayload = new MProperty(action.payload);
            state.properties = state.properties.map(property => property.id == updatePayload.id ? updatePayload : property);
            state.currentProperty = updatePayload;
        })
        builder.addCase(addPropertyOptionAction.fulfilled, (state, action) => {
            const addPayload = new MProperty(action.payload);
            state.properties = state.properties.map(property => property.id == addPayload.id ? addPayload : property);
            state.currentProperty = addPayload;
        })
        builder.addCase(updatePropertyOptionAction.fulfilled, (state, action) => {
            const updatePayload = new MProperty(action.payload);
            state.properties = state.properties.map(property => property.id == updatePayload.id ? updatePayload : property);
            state.currentProperty = updatePayload;
        })
        builder.addCase(deletePropertyOptionAction.fulfilled, (state, action) => {
          const deletePayload = new MProperty(action.payload);
          state.properties = state.properties.map(property => property.id == deletePayload.id ? deletePayload : property);
          state.currentProperty = deletePayload;
        });
        builder.addCase(deletePropertyAction.fulfilled, (state, action) => {
            const deletePayload = new MProperty(action.payload);
            state.properties = state.properties.filter(property => property.id !== deletePayload.id);
        })
    },
})

export const { setCurrentProperty, setCurrentPropertyOption } = slice.actions

export default slice