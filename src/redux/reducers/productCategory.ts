import { IProductCategoryState } from '../../interfaces/product/redux/categoryState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getProductCategoriesAction, addProductCategoryAction, updateProductCategoryAction, deleteProductCategoryAction } from '../actions/productCategory';
import { addProductSubcategoryAction, updateProductSubcategoryAction, deleteProductSubcategoryAction } from '../actions/productCategory';
import { MProductCategory } from 'src/models/product/category';
import { IProductCategory } from 'src/interfaces/product/category';

const initialState: IProductCategoryState = {
    productCategories: [],
    currentProductCategory: undefined,
    currentProductSubcategory: undefined
}

const slice = createSlice({
    initialState,
    name: 'productCategory',
    reducers: {
        setCurrentProductCategory(state, action) {
            state.currentProductCategory = action.payload
        },
        setCurrentProductSubcategory(state, action) {
            state.currentProductSubcategory = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IProductCategory[]>('productCategory/get'), (state, action) => {
            const productCategories = action.payload.map((productCategory) => new MProductCategory(productCategory));
            state.productCategories = productCategories;
        })
        builder.addCase(getProductCategoriesAction.fulfilled, (state, action) => {
            const productCategories = action.payload.map((productCategory) => new MProductCategory(productCategory));
            state.productCategories = productCategories;
        })
        builder.addCase(addProductCategoryAction.fulfilled, (state, action) => {
            const productCategory = new MProductCategory(action.payload);
            state.productCategories = [productCategory, ...state.productCategories];
            state.currentProductCategory = productCategory;
        })
        builder.addCase(updateProductCategoryAction.fulfilled, (state, action) => {
            const updatePayload = new MProductCategory(action.payload);
            state.productCategories = state.productCategories.map(productCategory => productCategory.id == updatePayload.id ? updatePayload : productCategory);
            state.currentProductCategory = updatePayload;
        })
        builder.addCase(addProductSubcategoryAction.fulfilled, (state, action) => {
            const addPayload = new MProductCategory(action.payload);
            state.productCategories = state.productCategories.map(productCategory => productCategory.id == addPayload.id ? addPayload : productCategory);
            state.currentProductCategory = addPayload;
        })
        builder.addCase(updateProductSubcategoryAction.fulfilled, (state, action) => {
            const updatePayload = new MProductCategory(action.payload);
            state.productCategories = state.productCategories.map(productCategory => productCategory.id == updatePayload.id ? updatePayload : productCategory);
            state.currentProductCategory = updatePayload;
        })
        builder.addCase(deleteProductSubcategoryAction.fulfilled, (state, action) => {
          const deletePayload = new MProductCategory(action.payload);
          state.productCategories = state.productCategories.map(productCategory => productCategory.id == deletePayload.id ? deletePayload : productCategory);
          state.currentProductCategory = deletePayload;
        });
        builder.addCase(deleteProductCategoryAction.fulfilled, (state, action) => {
            const deletePayload = new MProductCategory(action.payload);
            state.productCategories = state.productCategories.filter(productCategory => productCategory.id !== deletePayload.id);
        })
    },
})

export const { setCurrentProductCategory, setCurrentProductSubcategory } = slice.actions

export default slice