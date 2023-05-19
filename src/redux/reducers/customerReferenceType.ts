import { ICustomerReferenceTypeState } from '../../interfaces/customer/redux/referenceTypeState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getCustomerReferenceTypesAction, addCustomerReferenceTypeAction, updateCustomerReferenceTypeAction, deleteCustomerReferenceTypeAction } from '../actions/customerReferenceType';
import { MCustomerReferenceType } from 'src/models/customer/referenceType';
import { ICustomerReferenceType } from 'src/interfaces/customer/referenceType';

const initialState: ICustomerReferenceTypeState = {
    customerReferenceTypes: [],
    currentCustomerReferenceType: undefined
}

const slice = createSlice({
    initialState,
    name: 'customerReferenceType',
    reducers: {
        setCurrentCustomerReferenceType(state, action) {
            state.currentCustomerReferenceType = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<ICustomerReferenceType[]>('customerReferenceType/get'), (state, action) => {
            const customerReferenceTypes = action.payload.map((customerReferenceType) => new MCustomerReferenceType(customerReferenceType));
            state.customerReferenceTypes = customerReferenceTypes
        })
        builder.addCase(getCustomerReferenceTypesAction.fulfilled, (state, action) => {
            const customerReferenceTypes = action.payload.map((customerReferenceType) => new MCustomerReferenceType(customerReferenceType));
            state.customerReferenceTypes = customerReferenceTypes
        })
        builder.addCase(addCustomerReferenceTypeAction.fulfilled, (state, action) => {
            const customerReferenceType = new MCustomerReferenceType(action.payload);
            state.customerReferenceTypes = [customerReferenceType, ...state.customerReferenceTypes];
            state.currentCustomerReferenceType = customerReferenceType;
        })
        builder.addCase(updateCustomerReferenceTypeAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomerReferenceType(action.payload);
            state.customerReferenceTypes = state.customerReferenceTypes.map(customerReferenceType => customerReferenceType.id == updatePayload.id ? updatePayload : customerReferenceType);
            state.currentCustomerReferenceType = updatePayload;
        })
        builder.addCase(deleteCustomerReferenceTypeAction.fulfilled, (state, action) => {
            const deletePayload = new MCustomerReferenceType(action.payload);
            state.customerReferenceTypes = state.customerReferenceTypes.filter(customerReferenceType => customerReferenceType.id !== deletePayload.id);
        })
    },
})

export const { setCurrentCustomerReferenceType } = slice.actions

export default slice