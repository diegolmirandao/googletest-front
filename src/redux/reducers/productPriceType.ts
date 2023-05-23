import { IProductPriceTypeState } from '../../interfaces/product/redux/priceTypeState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getProductPriceTypesAction, addProductPriceTypeAction, updateProductPriceTypeAction, deleteProductPriceTypeAction } from '../actions/productPriceType'
import { MProductPriceType } from 'src/models/product/priceType';
import { IProductPriceType } from 'src/interfaces/product/priceType';

const initialState: IProductPriceTypeState = {
    productPriceTypes: [],
    currentProductPriceType: undefined
}

const slice = createSlice({
    initialState,
    name: 'productPriceType',
    reducers: {
        setCurrentProductPriceType(state, action) {
            state.currentProductPriceType = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IProductPriceType[]>('productPriceType/get'), (state, action) => {
            const productPriceTypes = action.payload.map((productPriceType) => new MProductPriceType(productPriceType));
            state.productPriceTypes = productPriceTypes;
        })
        builder.addCase(getProductPriceTypesAction.fulfilled, (state, action) => {
            const productPriceTypes = action.payload.map((productPriceType) => new MProductPriceType(productPriceType));
            state.productPriceTypes = productPriceTypes
        })
        builder.addCase(addProductPriceTypeAction.fulfilled, (state, action) => {
            const productPriceType = new MProductPriceType(action.payload);
            state.productPriceTypes = [productPriceType, ...state.productPriceTypes];
            state.currentProductPriceType = productPriceType;
        })
        builder.addCase(updateProductPriceTypeAction.fulfilled, (state, action) => {
            const updatePayload = new MProductPriceType(action.payload);
            state.productPriceTypes = state.productPriceTypes.map(productPriceType => productPriceType.id == updatePayload.id ? updatePayload : productPriceType);
            state.currentProductPriceType = updatePayload;
        })
        builder.addCase(deleteProductPriceTypeAction.fulfilled, (state, action) => {
            const deletePayload = new MProductPriceType(action.payload);
            state.productPriceTypes = state.productPriceTypes.filter(productPriceType => productPriceType.id !== deletePayload.id);
        })
    },
})

export const { setCurrentProductPriceType } = slice.actions

export default slice