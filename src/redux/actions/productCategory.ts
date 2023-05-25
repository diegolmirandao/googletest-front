import { IUpdateProductCategory } from '../../interfaces/product/updateCategory';
import { IProductCategory } from 'src/interfaces/product/category';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateProductSubcategory } from 'src/interfaces/product/addUpdateSubcategory';
import { IAddProductCategory } from 'src/interfaces/product/addCategory';

export const getProductCategoriesAction = createAsyncThunk(
    'productCategory/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: productCategoryResponse}: AxiosResponse<IProductCategory[]> = await axios.get(`/product-categories`);

            return productCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductCategoryAction = createAsyncThunk(
    'productCategory/add',
    async (addData: IAddProductCategory, {rejectWithValue}) => {
        try {
            const {data: productCategoryResponse}: AxiosResponse<IProductCategory> = await axios.post('/product-categories', addData);

            return productCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductCategoryAction = createAsyncThunk(
    'productCategory/update',
    async (updateData: IUpdateProductCategory, {getState, rejectWithValue}) => {
        try {
            const { productCategoryReducer: { currentProductCategory } } = getState() as RootState;
            const {data: productCategoryResponse}: AxiosResponse<IProductCategory> = await axios.put(`/product-categories/${currentProductCategory?.id}`, updateData);

            return productCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addProductSubcategoryAction = createAsyncThunk(
    'productSubcategory/add',
    async (addData: IAddUpdateProductSubcategory, {getState, rejectWithValue}) => {
        try {
            const { productCategoryReducer: { currentProductCategory } } = getState() as RootState;
            const {data: productSubcategoryResponse}: AxiosResponse<IProductCategory> = await axios.post(`/product-categories/${currentProductCategory?.id}/subcategories/`, addData);

            return productSubcategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateProductSubcategoryAction = createAsyncThunk(
    'productSubcategory/update',
    async (updateData: IAddUpdateProductSubcategory, {getState, rejectWithValue}) => {
        try {
            const { productCategoryReducer: { currentProductCategory, currentProductSubcategory } } = getState() as RootState;
            const {data: productSubcategoryResponse}: AxiosResponse<IProductCategory> = await axios.put(`/product-categories/${currentProductCategory?.id}/subcategories/${currentProductSubcategory?.id}`, updateData);

            return productSubcategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductSubcategoryAction = createAsyncThunk(
    'productSubcategory/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productCategoryReducer: { currentProductCategory, currentProductSubcategory } } = getState() as RootState;
            const {data: productSubcategoryResponse}: AxiosResponse<IProductCategory> = await axios.delete(`/product-categories/${currentProductCategory?.id}/subcategories/${currentProductSubcategory?.id}`);

            return productSubcategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteProductCategoryAction = createAsyncThunk(
    'productCategory/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { productCategoryReducer: { currentProductCategory } } = getState() as RootState;
            const {data: productCategoryResponse}: AxiosResponse<IProductCategory> = await axios.delete(`/product-categories/${currentProductCategory?.id}`);

            return productCategoryResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);