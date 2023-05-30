import { ICustomerState } from '../../interfaces/customer/redux/customerState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getCustomersAction, addCustomerAction, updateCustomerAction, deleteCustomerAction, showCustomerAction } from '../actions/customer';
import { deleteCustomerBillingAddressAction, updateCustomerBillingAddressAction, addCustomerBillingAddressAction } from '../actions/customer';
import { deleteCustomerReferenceAction, updateCustomerReferenceAction, addCustomerReferenceAction } from '../actions/customer';
import { addCustomerAddressAction, updateCustomerAddressAction, deleteCustomerAddressAction } from '../actions/customer';
import { MCustomer } from 'src/models/customer/customer';
import { ICustomer } from 'src/interfaces/customer/customer';

const initialState: ICustomerState = {
    customers: [],
    filteredCustomers: null,
    cursor: null,
    filteredCursor: null,
    currentCustomer: undefined,
    currentCustomerBillingAddress: undefined,
    currentCustomerReference: undefined,
    currentCustomerAddress: undefined
}

const slice = createSlice({
    initialState,
    name: 'customer',
    reducers: {
        resetFilteredCustomers(state) {
            state.filteredCustomers = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentCustomer(state, action) {
            state.currentCustomer = action.payload;
        },
        setCurrentCustomerBillingAddress(state, action) {
            state.currentCustomerBillingAddress = action.payload;
        },
        setCurrentCustomerReference(state, action) {
            state.currentCustomerReference = action.payload;
        },
        setCurrentCustomerAddress(state, action) {
            state.currentCustomerAddress = action.payload;
        },
        deleteCustomer(state, payload) {
            state.customers = state.customers.filter(customer => customer.id !== Number(payload));
        }
    },
    extraReducers(builder) {
        builder.addCase(getCustomersAction.fulfilled, (state, action) => {
            const params = action.meta.arg;
            const customers = action.payload.data.map((customer) => new MCustomer(customer));
            
            if (params.filters || (JSON.stringify(params.sorts) !== JSON.stringify({'f_params[orderBy][field]': "created_at", 'f_params[orderBy][type]': "desc"}))) {
                state.filteredCustomers = customers;
                state.filteredCursor = action.payload.next_cursor;
            } else {
                state.customers = state.customers.length && state.cursor ? [...state.customers, ...customers] : customers;
                state.cursor = action.payload.next_cursor;
            }
        })
        builder.addCase(showCustomerAction.fulfilled, (state, action) => {
            const receivedCustomer = new MCustomer(action.payload);
            const existingCustomer = state.customers.find(customer => customer.id == receivedCustomer.id);
            if (existingCustomer) {
                state.customers = state.customers.map(customer => customer.id == receivedCustomer.id ? receivedCustomer : customer);
            } else {
                state.customers = [receivedCustomer, ...state.customers];
            }
        })
        builder.addCase(addCustomerAction.fulfilled, (state, action) => {
            const customer = new MCustomer(action.payload);
            state.customers = [customer, ...state.customers];
            state.filteredCustomers = state.filteredCustomers ? [customer, ...state.filteredCustomers] : null;
            state.currentCustomer = customer;
        })
        builder.addCase(updateCustomerAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == updatePayload.id ? updatePayload : customer) : null;
            state.currentCustomer = updatePayload;
        })
        builder.addCase(addCustomerBillingAddressAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == addPayload.id ? addPayload : customer) : null;
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerBillingAddressAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == updatePayload.id ? updatePayload : customer) : null;
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerBillingAddressAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == deletePayload.id ? deletePayload : customer) : null;
          state.currentCustomer = deletePayload;
        });
        builder.addCase(addCustomerReferenceAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == addPayload.id ? addPayload : customer) : null;
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerReferenceAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == updatePayload.id ? updatePayload : customer) : null;
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerReferenceAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == deletePayload.id ? deletePayload : customer) : null;
          state.currentCustomer = deletePayload;
        });
        builder.addCase(addCustomerAddressAction.fulfilled, (state, action) => {
            const addPayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == addPayload.id ? addPayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == addPayload.id ? addPayload : customer) : null;
            state.currentCustomer = addPayload;
        })
        builder.addCase(updateCustomerAddressAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomer(action.payload);
            state.customers = state.customers.map(customer => customer.id == updatePayload.id ? updatePayload : customer);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == updatePayload.id ? updatePayload : customer) : null;
            state.currentCustomer = updatePayload;
        })
        builder.addCase(deleteCustomerAddressAction.fulfilled, (state, action) => {
          const deletePayload = new MCustomer(action.payload);
          state.customers = state.customers.map(customer => customer.id == deletePayload.id ? deletePayload : customer);
          state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == deletePayload.id ? deletePayload : customer) : null;
          state.currentCustomer = deletePayload;
        });
        builder.addCase(deleteCustomerAction.fulfilled, (state, action) => {
            const deletePayload = new MCustomer(action.payload);
            state.customers = state.customers.filter(customer => customer.id !== deletePayload.id);
            state.filteredCustomers = state.filteredCustomers ? state.filteredCustomers.map(customer => customer.id == deletePayload.id ? deletePayload : customer) : null;
        })
        builder.addCase(createAction<ICustomer[]>('customer/sync'), (state, action) => {
            const syncCustomers = action.payload.map((customer) => new MCustomer(customer));

            if (state.customers.length) {
                syncCustomers.forEach((syncCustomer, index) => {
                    if (state.customers.find(customer => customer.id == syncCustomer.id)) {
                        state.customers = state.customers.map(customer => customer.id == syncCustomer.id ? syncCustomer : customer);
                        syncCustomers.splice(index, 1);
                    }
                });
                
                state.customers = [...state.customers, ...syncCustomers]
            } else {
                state.customers = syncCustomers
            }
        })
    },
});

export const { resetFilteredCustomers, setCursor, setFilteredCursor, setCurrentCustomer, setCurrentCustomerBillingAddress, setCurrentCustomerReference, setCurrentCustomerAddress, deleteCustomer } = slice.actions;

export default slice;