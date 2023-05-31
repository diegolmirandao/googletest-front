import { ISupplierState } from '../../interfaces/supplier/redux/supplierState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getSuppliersAction, addSupplierAction, updateSupplierAction, deleteSupplierAction, showSupplierAction } from '../actions/supplier';
import { deleteSupplierContactAction, updateSupplierContactAction, addSupplierContactAction } from '../actions/supplier';
import { addSupplierAddressAction, updateSupplierAddressAction, deleteSupplierAddressAction } from '../actions/supplier';
import { MSupplier } from 'src/models/supplier/supplier';
import { ISupplier } from 'src/interfaces/supplier/supplier';

const initialState: ISupplierState = {
    suppliers: [],
    filteredSuppliers: null,
    cursor: null,
    filteredCursor: null,
    currentSupplier: undefined,
    currentSupplierContact: undefined,
    currentSupplierAddress: undefined
}

const slice = createSlice({
    initialState,
    name: 'supplier',
    reducers: {
        resetFilteredSuppliers(state) {
            state.filteredSuppliers = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentSupplier(state, action) {
            state.currentSupplier = action.payload;
        },
        setCurrentSupplierContact(state, action) {
            state.currentSupplierContact = action.payload;
        },
        setCurrentSupplierAddress(state, action) {
            state.currentSupplierAddress = action.payload;
        },
        deleteSupplier(state, payload) {
            state.suppliers = state.suppliers.filter(supplier => supplier.id !== Number(payload));
        }
    },
    extraReducers(builder) {
        builder.addCase(getSuppliersAction.fulfilled, (state, action) => {
            const params = action.meta.arg;
            const suppliers = action.payload.data.map((supplier) => new MSupplier(supplier));
            
            if (params.filters || (JSON.stringify(params.sorts) !== JSON.stringify({'f_params[orderBy][field]': "created_at", 'f_params[orderBy][type]': "desc"}))) {
                state.filteredSuppliers = suppliers;
                state.filteredCursor = action.payload.next_cursor;
            } else {
                state.suppliers = state.suppliers.length && state.cursor ? [...state.suppliers, ...suppliers] : suppliers;
                state.cursor = action.payload.next_cursor;
            }
        })
        builder.addCase(showSupplierAction.fulfilled, (state, action) => {
            const receivedSupplier = new MSupplier(action.payload);
            const existingSupplier = state.suppliers.find(supplier => supplier.id == receivedSupplier.id);
            if (existingSupplier) {
                state.suppliers = state.suppliers.map(supplier => supplier.id == receivedSupplier.id ? receivedSupplier : supplier);
            } else {
                state.suppliers = [receivedSupplier, ...state.suppliers];
            }
        })
        builder.addCase(addSupplierAction.fulfilled, (state, action) => {
            const supplier = new MSupplier(action.payload);
            state.suppliers = [supplier, ...state.suppliers];
            state.filteredSuppliers = state.filteredSuppliers ? [supplier, ...state.filteredSuppliers] : null;
            state.currentSupplier = supplier;
        })
        builder.addCase(updateSupplierAction.fulfilled, (state, action) => {
            const updatePayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier) : null;
            state.currentSupplier = updatePayload;
        })
        builder.addCase(addSupplierContactAction.fulfilled, (state, action) => {
            const addPayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.map(supplier => supplier.id == addPayload.id ? addPayload : supplier);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == addPayload.id ? addPayload : supplier) : null;
            state.currentSupplier = addPayload;
        })
        builder.addCase(updateSupplierContactAction.fulfilled, (state, action) => {
            const updatePayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier) : null;
            state.currentSupplier = updatePayload;
        })
        builder.addCase(deleteSupplierContactAction.fulfilled, (state, action) => {
          const deletePayload = new MSupplier(action.payload);
          state.suppliers = state.suppliers.map(supplier => supplier.id == deletePayload.id ? deletePayload : supplier);
          state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == deletePayload.id ? deletePayload : supplier) : null;
          state.currentSupplier = deletePayload;
        });
        builder.addCase(addSupplierAddressAction.fulfilled, (state, action) => {
            const addPayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.map(supplier => supplier.id == addPayload.id ? addPayload : supplier);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == addPayload.id ? addPayload : supplier) : null;
            state.currentSupplier = addPayload;
        })
        builder.addCase(updateSupplierAddressAction.fulfilled, (state, action) => {
            const updatePayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == updatePayload.id ? updatePayload : supplier) : null;
            state.currentSupplier = updatePayload;
        })
        builder.addCase(deleteSupplierAddressAction.fulfilled, (state, action) => {
          const deletePayload = new MSupplier(action.payload);
          state.suppliers = state.suppliers.map(supplier => supplier.id == deletePayload.id ? deletePayload : supplier);
          state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == deletePayload.id ? deletePayload : supplier) : null;
          state.currentSupplier = deletePayload;
        });
        builder.addCase(deleteSupplierAction.fulfilled, (state, action) => {
            const deletePayload = new MSupplier(action.payload);
            state.suppliers = state.suppliers.filter(supplier => supplier.id !== deletePayload.id);
            state.filteredSuppliers = state.filteredSuppliers ? state.filteredSuppliers.map(supplier => supplier.id == deletePayload.id ? deletePayload : supplier) : null;
        })
        builder.addCase(createAction<ISupplier[]>('supplier/sync'), (state, action) => {
            const syncSuppliers = action.payload.map((supplier) => new MSupplier(supplier));

            if (state.suppliers.length) {
                syncSuppliers.forEach((syncSupplier, index) => {
                    if (state.suppliers.find(supplier => supplier.id == syncSupplier.id)) {
                        state.suppliers = state.suppliers.map(supplier => supplier.id == syncSupplier.id ? syncSupplier : supplier);
                        syncSuppliers.splice(index, 1);
                    }
                });
                
                state.suppliers = [...state.suppliers, ...syncSuppliers]
            } else {
                state.suppliers = syncSuppliers
            }
        })
    },
});

export const { resetFilteredSuppliers, setCursor, setFilteredCursor, setCurrentSupplier, setCurrentSupplierContact, setCurrentSupplierAddress, deleteSupplier } = slice.actions;

export default slice;