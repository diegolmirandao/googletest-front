import { ICustomerState } from '../../interfaces/customer/redux/customerState';
import { createSlice } from '@reduxjs/toolkit';
import { getCustomersAction, addCustomerAction, updateCustomerAction, deleteCustomerAction } from '../actions/customer';
import { deleteCustomerBillingAddressAction, updateCustomerBillingAddressAction, addCustomerBillingAddressAction } from '../actions/customer';
import { deleteCustomerReferenceAction, updateCustomerReferenceAction, addCustomerReferenceAction } from '../actions/customer';
import { addCustomerAddressAction, updateCustomerAddressAction, deleteCustomerAddressAction } from '../actions/customer';
import { MCustomer } from 'src/models/customer/customer';

const initialState: ICustomerState = {
    customers: [],
    filteredCustomers: null,
    cursor: null,
    currentCustomer: undefined,
    currentCustomerBillingAddress: undefined,
    currentCustomerReference: undefined,
    currentCustomerAddress: undefined
}

const slice = createSlice({
    initialState,
    name: 'customer',
    reducers: {
        setCurrentCustomer(state, action) {
            state.currentCustomer = action.payload
        },
        setCurrentCustomerBillingAddress(state, action) {
            state.currentCustomerBillingAddress = action.payload
        },
        setCurrentCustomerReference(state, action) {
            state.currentCustomerReference = action.payload
        },
        setCurrentCustomerAddress(state, action) {
            state.currentCustomerAddress = action.payload
        },
        setCursor(state, action) {
            state.cursor = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getCustomersAction.fulfilled, (state, action) => {
            const params = action.meta.arg;
            const customers = action.payload.data.map((customer) => new MCustomer(customer));

            if (params.filters) {
                state.filteredCustomers = customers;
            } else {
                state.customers = state.customers.length ? [...state.customers, ...customers] : customers;
            }
        })
        builder.addCase(addCustomerAction.fulfilled, (state, action) => {
            const customer = new MCustomer(action.payload);
            state.customers = [customer, ...state.customers];
            state.currentCustomer = customer;
        })
        builder.addCase(updateCustomerAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.currentCustomer = updatePayload;
        })
        builder.addCase(addCustomerBillingAddressAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerBillingAddressAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerBillingAddressAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.currentCustomer = deletePayload;
        });
        builder.addCase(addCustomerReferenceAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerReferenceAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerReferenceAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.currentCustomer = deletePayload;
        });
        builder.addCase(addCustomerAddressAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerAddressAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerAddressAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.currentCustomer = deletePayload;
        });
        builder.addCase(deleteCustomerAction.fulfilled, (state, action) => {
            const deletePayload = new MCustomer(action.payload);
            state.customers = state.customers.filter(customer => customer.id !== deletePayload.id);
        })
    },
})

export const { setCursor, setCurrentCustomer, setCurrentCustomerBillingAddress, setCurrentCustomerReference, setCurrentCustomerAddress } = slice.actions

export default slice