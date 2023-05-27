import { IVariantState } from '../../interfaces/product/redux/variantState';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { getVariantsAction, addVariantAction, updateVariantAction, deleteVariantAction } from '../actions/variant';
import { addVariantOptionAction, updateVariantOptionAction, deleteVariantOptionAction } from '../actions/variant';
import { MVariant } from 'src/models/product/variant';
import { IVariant } from 'src/interfaces/product/variant';

const initialState: IVariantState = {
    variants: [],
    currentVariant: undefined,
    currentVariantOption: undefined
}

const slice = createSlice({
    initialState,
    name: 'variant',
    reducers: {
        setCurrentVariant(state, action) {
            state.currentVariant = action.payload
        },
        setCurrentVariantOption(state, action) {
            state.currentVariantOption = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IVariant[]>('variant/get'), (state, action) => {
            const variants = action.payload.map((variant) => new MVariant(variant));
            state.variants = variants;
        })
        builder.addCase(getVariantsAction.fulfilled, (state, action) => {
            const variants = action.payload.map((variant) => new MVariant(variant));
            state.variants = variants
        })
        builder.addCase(addVariantAction.fulfilled, (state, action) => {
            const variant = new MVariant(action.payload);
            state.variants = [variant, ...state.variants];
            state.currentVariant = variant;
        })
        builder.addCase(updateVariantAction.fulfilled, (state, action) => {
            const updatePayload = new MVariant(action.payload);
            state.variants = state.variants.map(variant => variant.id == updatePayload.id ? updatePayload : variant);
            state.currentVariant = updatePayload;
        })
        builder.addCase(addVariantOptionAction.fulfilled, (state, action) => {
            const addPayload = new MVariant(action.payload);
            state.variants = state.variants.map(variant => variant.id == addPayload.id ? addPayload : variant);
            state.currentVariant = addPayload;
        })
        builder.addCase(updateVariantOptionAction.fulfilled, (state, action) => {
            const updatePayload = new MVariant(action.payload);
            state.variants = state.variants.map(variant => variant.id == updatePayload.id ? updatePayload : variant);
            state.currentVariant = updatePayload;
        })
        builder.addCase(deleteVariantOptionAction.fulfilled, (state, action) => {
          const deletePayload = new MVariant(action.payload);
          state.variants = state.variants.map(variant => variant.id == deletePayload.id ? deletePayload : variant);
          state.currentVariant = deletePayload;
        });
        builder.addCase(deleteVariantAction.fulfilled, (state, action) => {
            const deletePayload = new MVariant(action.payload);
            state.variants = state.variants.filter(variant => variant.id !== deletePayload.id);
        })
    },
})

export const { setCurrentVariant, setCurrentVariantOption } = slice.actions

export default slice