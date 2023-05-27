import { IProductTypeState } from '../../interfaces/product/redux/typeState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { MProductType } from 'src/models/product/type';
import { IProductType } from 'src/interfaces/product/type';

const initialState: IProductTypeState = {
    productTypes: []
}

const slice = createSlice({
    initialState,
    name: 'productType',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(createAction<IProductType[]>('productType/get'), (state, action) => {
            const productTypes = action.payload.map((productType) => new MProductType(productType));
            state.productTypes = productTypes;
        })
    },
})

export default slice