import { ICustomerCategoryState } from '../../interfaces/customer/redux/categoryState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getCustomerCategoriesAction, addCustomerCategoryAction, updateCustomerCategoryAction, deleteCustomerCategoryAction } from '../actions/customerCategory';
import { MCustomerCategory } from 'src/models/customer/category';
import { ICustomerCategory } from 'src/interfaces/customer/category';

const initialState: ICustomerCategoryState = {
    customerCategories: [],
    currentCustomerCategory: undefined
}

const slice = createSlice({
    initialState,
    name: 'customerCategory',
    reducers: {
        setCurrentCustomerCategory(state, action) {
            state.currentCustomerCategory = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<ICustomerCategory[]>('customerCategory/get'), (state, action) => {
            const customerCategories = action.payload.map((customerCategory) => new MCustomerCategory(customerCategory));
            state.customerCategories = customerCategories
        })
        builder.addCase(getCustomerCategoriesAction.fulfilled, (state, action) => {
            const customerCategories = action.payload.map((customerCategory) => new MCustomerCategory(customerCategory));
            state.customerCategories = customerCategories
        })
        builder.addCase(addCustomerCategoryAction.fulfilled, (state, action) => {
            const customerCategory = new MCustomerCategory(action.payload);
            state.customerCategories = [customerCategory, ...state.customerCategories];
            state.currentCustomerCategory = customerCategory;
        })
        builder.addCase(updateCustomerCategoryAction.fulfilled, (state, action) => {
            const updatePayload = new MCustomerCategory(action.payload);
            state.customerCategories = state.customerCategories.map(customerCategory => customerCategory.id == updatePayload.id ? updatePayload : customerCategory);
            state.currentCustomerCategory = updatePayload;
        })
        builder.addCase(deleteCustomerCategoryAction.fulfilled, (state, action) => {
            const deletePayload = new MCustomerCategory(action.payload);
            state.customerCategories = state.customerCategories.filter(customerCategory => customerCategory.id !== deletePayload.id);
        })
    },
})

export const { setCurrentCustomerCategory } = slice.actions

export default slice