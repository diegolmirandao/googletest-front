import { IEstablishmentState } from '../../interfaces/establishment/redux/establishmentState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getEstablishmentsAction, addEstablishmentAction, updateEstablishmentAction, deleteEstablishmentAction } from '../actions/establishment';
import { addPointOfSaleAction, updatePointOfSaleAction, deletePointOfSaleAction } from '../actions/establishment';
import { MEstablishment } from 'src/models/establishment';
import { IEstablishment } from 'src/interfaces/establishment/establishment';

const initialState: IEstablishmentState = {
    establishments: [],
    currentEstablishment: undefined,
    currentPointOfSale: undefined
}

const slice = createSlice({
    initialState,
    name: 'establishment',
    reducers: {
        setCurrentEstablishment(state, action) {
            state.currentEstablishment = action.payload
        },
        setCurrentPointOfSale(state, action) {
            state.currentPointOfSale = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IEstablishment[]>('establishment/get'), (state, action) => {
            const establishments = action.payload.map((establishment) => new MEstablishment(establishment));
            state.establishments = establishments
        })
        builder.addCase(getEstablishmentsAction.fulfilled, (state, action) => {
            const establishments = action.payload.map((establishment) => new MEstablishment(establishment));
            state.establishments = establishments
        })
        builder.addCase(addEstablishmentAction.fulfilled, (state, action) => {
            const establishment = new MEstablishment(action.payload);
            state.establishments = [establishment, ...state.establishments];
            state.currentEstablishment = establishment;
        })
        builder.addCase(updateEstablishmentAction.fulfilled, (state, action) => {
            const updatePayload = new MEstablishment(action.payload);
            state.establishments = state.establishments.map(establishment => establishment.id == updatePayload.id ? updatePayload : establishment);
            state.currentEstablishment = updatePayload;
        })
        builder.addCase(addPointOfSaleAction.fulfilled, (state, action) => {
            const addPayload = new MEstablishment(action.payload);
            state.establishments = state.establishments.map(establishment => establishment.id == addPayload.id ? addPayload : establishment);
            state.currentEstablishment = addPayload;
        })
        builder.addCase(updatePointOfSaleAction.fulfilled, (state, action) => {
            const updatePayload = new MEstablishment(action.payload);
            state.establishments = state.establishments.map(establishment => establishment.id == updatePayload.id ? updatePayload : establishment);
            state.currentEstablishment = updatePayload;
        })
        builder.addCase(deletePointOfSaleAction.fulfilled, (state, action) => {
          const deletePayload = new MEstablishment(action.payload);
          state.establishments = state.establishments.map(establishment => establishment.id == deletePayload.id ? deletePayload : establishment);
          state.currentEstablishment = deletePayload;
        });
        builder.addCase(deleteEstablishmentAction.fulfilled, (state, action) => {
            const deletePayload = new MEstablishment(action.payload);
            state.establishments = state.establishments.filter(establishment => establishment.id !== deletePayload.id);
        })
    },
})

export const { setCurrentEstablishment, setCurrentPointOfSale } = slice.actions

export default slice