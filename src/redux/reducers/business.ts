import { createAction, createSlice } from '@reduxjs/toolkit'
import { getBusinessesAction, addBusinessAction, updateBusinessAction, deleteBusinessAction } from '../actions/business'
import { MBusiness } from 'src/models/business';
import { IBusinessState } from 'src/interfaces/business/redux/businessState';
import { IBusiness } from 'src/interfaces/business/business';

const initialState: IBusinessState = {
    businesses: [],
    currentBusiness: undefined
}

const slice = createSlice({
    initialState,
    name: 'business',
    reducers: {
        setCurrentBusiness(state, action) {
            state.currentBusiness = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IBusiness[]>('business/get'), (state, action) => {
            const businesses = action.payload.map((business) => new MBusiness(business));
            state.businesses = businesses;
        })
        builder.addCase(getBusinessesAction.fulfilled, (state, action) => {
            const businesses = action.payload.map((business) => new MBusiness(business));
            state.businesses = businesses;
        })
        builder.addCase(addBusinessAction.fulfilled, (state, action) => {
            const business = new MBusiness(action.payload);
            state.businesses = [business, ...state.businesses];
            state.currentBusiness = business;
        })
        builder.addCase(updateBusinessAction.fulfilled, (state, action) => {
            const updatePayload = new MBusiness(action.payload);
            state.businesses = state.businesses.map(business => business.id == updatePayload.id ? updatePayload : business);
            state.currentBusiness = updatePayload;
        })
        builder.addCase(deleteBusinessAction.fulfilled, (state, action) => {
            const deletePayload = new MBusiness(action.payload);
            state.businesses = state.businesses.filter(business => business.id !== deletePayload.id);
        })
    },
})

export const { setCurrentBusiness } = slice.actions

export default slice