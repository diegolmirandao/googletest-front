import { IAddUpdateCustomerCategory } from '../../interfaces/customer/addUpdateCategory';
import { ICustomerCategory } from 'src/interfaces/customer/category';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';

export const getCustomerCategoriesAction = createAsyncThunk(
    'customerCategory/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: customerCategoryResponse}: AxiosResponse<ICustomerCategory[]> = await axios.get(`/customer-categories`);

            return customerCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addCustomerCategoryAction = createAsyncThunk(
    'customerCategory/add',
    async (addData: IAddUpdateCustomerCategory, {rejectWithValue}) => {
        try {
            const {data: customerCategoryResponse}: AxiosResponse<ICustomerCategory> = await axios.post('/customer-categories', addData);

            return customerCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateCustomerCategoryAction = createAsyncThunk(
    'customerCategory/update',
    async (updateData: IAddUpdateCustomerCategory, {getState, rejectWithValue}) => {
        try {
            const { customerCategoryReducer: { currentCustomerCategory } } = getState() as RootState;
            const {data: customerCategoryResponse}: AxiosResponse<ICustomerCategory> = await axios.put(`/customer-categories/${currentCustomerCategory?.id}`, updateData);

            return customerCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteCustomerCategoryAction = createAsyncThunk(
    'customerCategory/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { customerCategoryReducer: { currentCustomerCategory } } = getState() as RootState;
            const {data: customerCategoryResponse}: AxiosResponse<ICustomerCategory> = await axios.delete(`/customer-categories/${currentCustomerCategory?.id}`);

            return customerCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);