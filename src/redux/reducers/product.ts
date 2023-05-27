import { IProductState } from '../../interfaces/product/redux/productState';
import { createSlice } from '@reduxjs/toolkit';
import { getProductsAction, addProductAction, updateProductAction, deleteProductAction, getProductDetailsAction, deleteProductDetailPriceAction, updateProductDetailPriceAction, addProductDetailPriceAction, addProductDetailCostAction, updateProductDetailCostAction, deleteProductDetailCostAction } from '../actions/product';
import { addProductDetailAction, updateProductDetailAction, deleteProductDetailAction } from '../actions/product';
import { MProduct } from 'src/models/product/product';
import { MProductDetail } from 'src/models/product/detail';

const initialState: IProductState = {
    products: [],
    filteredProducts: null,
    cursor: null,
    filteredCursor: null,
    productDetails: [],
    currentProduct: undefined,
    currentProductDetail: undefined,
    currentProductDetailPrice: undefined,
    currentProductDetailCost: undefined
}

const slice = createSlice({
    initialState,
    name: 'product',
    reducers: {
        resetFilteredProducts(state) {
            state.filteredProducts = null;
        },
        setCursor(state, action) {
            state.cursor = action.payload;
        },
        setFilteredCursor(state, action) {
            state.filteredCursor = action.payload;
        },
        setCurrentProduct(state, action) {
            state.currentProduct = action.payload
        },
        setCurrentProductDetail(state, action) {
            state.currentProductDetail = action.payload
        },
        setCurrentProductDetailPrice(state, action) {
            state.currentProductDetailPrice = action.payload
        },
        setCurrentProductDetailCost(state, action) {
            state.currentProductDetailCost = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getProductsAction.fulfilled, (state, action) => {
            const products = action.payload.data.map((product) => new MProduct(product));
            state.products = products
        })
        builder.addCase(addProductAction.fulfilled, (state, action) => {
            const product = new MProduct(action.payload);
            state.products = [product, ...state.products];
            state.currentProduct = product;
            if (product.details?.[0].variants.length == 0) {
                state.currentProductDetail = product.details[0];
            }
        })
        builder.addCase(updateProductAction.fulfilled, (state, action) => {
            const updatePayload = new MProduct(action.payload);
            state.products = state.products.map(product => product.id == updatePayload.id ? updatePayload : product);
            state.currentProduct = updatePayload;
            if (updatePayload.details?.[0].variants.length == 0) {
                state.currentProductDetail = updatePayload.details[0];
            }
        })
        builder.addCase(getProductDetailsAction.fulfilled, (state, action) => {
            const productDetails = action.payload.data.map((productDetail) => new MProductDetail(productDetail));
            state.productDetails = productDetails
        })
        builder.addCase(addProductDetailAction.fulfilled, (state, action) => {
            const addPayload = new MProduct(action.payload);
            state.products = state.products.map(product => product.id == addPayload.id ? addPayload : product);
            state.currentProduct = addPayload;
        })
        builder.addCase(updateProductDetailAction.fulfilled, (state, action) => {
            const updatePayload = new MProduct(action.payload);
            const productDetailId = state.currentProductDetail?.id;
            state.products = state.products.map(product => product.id == updatePayload.id ? updatePayload : product);
            state.currentProduct = updatePayload;
            state.currentProductDetail = updatePayload.details?.find(detail => detail.id == productDetailId);
        })
        builder.addCase(deleteProductDetailAction.fulfilled, (state, action) => {
          const deletePayload = new MProduct(action.payload);
          state.products = state.products.map(product => product.id == deletePayload.id ? deletePayload : product);
          state.currentProduct = deletePayload;
        });
        builder.addCase(addProductDetailPriceAction.fulfilled, (state, action) => {
            const addPayload = new MProduct(action.payload);
            const productDetailId = state.currentProductDetail?.id;
            state.products = state.products.map(product => product.id == addPayload.id ? addPayload : product);
            state.currentProduct = addPayload;
            state.currentProductDetail = addPayload.details?.find(detail => detail.id == productDetailId);
        })
        builder.addCase(updateProductDetailPriceAction.fulfilled, (state, action) => {
            const updatePayload = new MProduct(action.payload);
            const productDetailId = state.currentProductDetail?.id;
            state.products = state.products.map(product => product.id == updatePayload.id ? updatePayload : product);
            state.currentProduct = updatePayload;
            state.currentProductDetail = updatePayload.details?.find(detail => detail.id == productDetailId);
        })
        builder.addCase(deleteProductDetailPriceAction.fulfilled, (state, action) => {
          const deletePayload = new MProduct(action.payload);
          const productDetailId = state.currentProductDetail?.id;
          state.products = state.products.map(product => product.id == deletePayload.id ? deletePayload : product);
          state.currentProduct = deletePayload;
          state.currentProductDetail = deletePayload.details?.find(detail => detail.id == productDetailId);
        });
        builder.addCase(addProductDetailCostAction.fulfilled, (state, action) => {
            const addPayload = new MProduct(action.payload);
            const productDetailId = state.currentProductDetail?.id;
            state.products = state.products.map(product => product.id == addPayload.id ? addPayload : product);
            state.currentProduct = addPayload;
            state.currentProductDetail = addPayload.details?.find(detail => detail.id == productDetailId);
        })
        builder.addCase(updateProductDetailCostAction.fulfilled, (state, action) => {
            const updatePayload = new MProduct(action.payload);
            const productDetailId = state.currentProductDetail?.id;
            state.products = state.products.map(product => product.id == updatePayload.id ? updatePayload : product);
            state.currentProduct = updatePayload;
            state.currentProductDetail = updatePayload.details?.find(detail => detail.id == productDetailId);
        })
        builder.addCase(deleteProductDetailCostAction.fulfilled, (state, action) => {
          const deletePayload = new MProduct(action.payload);
          const productDetailId = state.currentProductDetail?.id;
          state.products = state.products.map(product => product.id == deletePayload.id ? deletePayload : product);
          state.currentProduct = deletePayload;
          state.currentProductDetail = deletePayload.details?.find(detail => detail.id == productDetailId);
        });
        builder.addCase(deleteProductAction.fulfilled, (state, action) => {
            const deletePayload = new MProduct(action.payload);
            state.products = state.products.filter(product => product.id !== deletePayload.id);
        })
    },
})

export const { resetFilteredProducts, setCursor, setFilteredCursor, setCurrentProduct, setCurrentProductDetail, setCurrentProductDetailPrice, setCurrentProductDetailCost } = slice.actions

export default slice