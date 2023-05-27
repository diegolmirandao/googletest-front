import { IProductCostTypeState } from '../../interfaces/product/redux/costTypeState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getProductCostTypesAction, addProductCostTypeAction, updateProductCostTypeAction, deleteProductCostTypeAction } from '../actions/productCostType'
import { MProductCostType } from 'src/models/product/costType';
import { IProductCostType } from 'src/interfaces/product/costType';

const initialState: IProductCostTypeState = {
    productCostTypes: [],
    currentProductCostType: undefined
}

const slice = createSlice({
    initialState,
    name: 'productCostType',
    reducers: {
        setCurrentProductCostType(state, action) {
            state.currentProductCostType = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IProductCostType[]>('productCostType/get'), (state, action) => {
            const productCostTypes = action.payload.map((productCostType) => new MProductCostType(productCostType));
            state.productCostTypes = productCostTypes;
        })
        builder.addCase(getProductCostTypesAction.fulfilled, (state, action) => {
            const productCostTypes = action.payload.map((productCostType) => new MProductCostType(productCostType));
            state.productCostTypes = productCostTypes
        })
        builder.addCase(addProductCostTypeAction.fulfilled, (state, action) => {
            const productCostType = new MProductCostType(action.payload);
            state.productCostTypes = [productCostType, ...state.productCostTypes];
            state.currentProductCostType = productCostType;
        })
        builder.addCase(updateProductCostTypeAction.fulfilled, (state, action) => {
            const updatePayload = new MProductCostType(action.payload);
            state.productCostTypes = state.productCostTypes.map(productCostType => productCostType.id == updatePayload.id ? updatePayload : productCostType);
            state.currentProductCostType = updatePayload;
        })
        builder.addCase(deleteProductCostTypeAction.fulfilled, (state, action) => {
            const deletePayload = new MProductCostType(action.payload);
            state.productCostTypes = state.productCostTypes.filter(productCostType => productCostType.id !== deletePayload.id);
        })
    },
})

export const { setCurrentProductCostType } = slice.actions

export default slice