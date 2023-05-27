import { IBrandState } from '../../interfaces/product/redux/brandState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getBrandsAction, addBrandAction, updateBrandAction, deleteBrandAction } from '../actions/brand'
import { MBrand } from 'src/models/product/brand';
import { IBrand } from 'src/interfaces/product/brand';

const initialState: IBrandState = {
    brands: [],
    currentBrand: undefined
}

const slice = createSlice({
    initialState,
    name: 'brand',
    reducers: {
        setCurrentBrand(state, action) {
            state.currentBrand = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IBrand[]>('brand/get'), (state, action) => {
            const brands = action.payload.map((brand) => new MBrand(brand));
            state.brands = brands;
        })
        builder.addCase(getBrandsAction.fulfilled, (state, action) => {
            const brands = action.payload.map((brand) => new MBrand(brand));
            state.brands = brands;
        })
        builder.addCase(addBrandAction.fulfilled, (state, action) => {
            const brand = new MBrand(action.payload);
            state.brands = [brand, ...state.brands];
            state.currentBrand = brand;
        })
        builder.addCase(updateBrandAction.fulfilled, (state, action) => {
            const updatePayload = new MBrand(action.payload);
            state.brands = state.brands.map(brand => brand.id == updatePayload.id ? updatePayload : brand);
            state.currentBrand = updatePayload;
        })
        builder.addCase(deleteBrandAction.fulfilled, (state, action) => {
            const deletePayload = new MBrand(action.payload);
            state.brands = state.brands.filter(brand => brand.id !== deletePayload.id);
        })
    },
})

export const { setCurrentBrand } = slice.actions

export default slice