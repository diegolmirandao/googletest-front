import { combineReducers } from 'redux';
import authSlice from './auth';
import offline from './offline';
import init from './init';
import currencySlice from './currency';
import businessSlice from './business';
import establishmentSlice from './establishment';
import warehouseSlice from './warehouse';
import countrySlice from './country';

import userSlice from './user';
import roleSlice from './role';

import customerSlice from './customer';
import customerCategorySlice from './customerCategory';
import acquisitionChannelSlice from './acquisitionChannel';
import customerReferenceTypeSlice from './customerReferenceType';

import productSlice from './product';
import productTypeSlice from './productType';
import measurementUnitSlice from './measurementUnit';
import productCategorySlice from './productCategory';
import productPriceTypeSlice from './productPriceType';
import productCostTypeSlice from './productCostType';
import brandSlice from './brand';
import propertySlice from './property';
import variantSlice from './variant';

import paymentTermSlice from './paymentTerm';

export default combineReducers({
    authReducer: authSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    currencyReducer: currencySlice.reducer,
    businessReducer: businessSlice.reducer,
    establishmentReducer: establishmentSlice.reducer,
    warehouseReducer: warehouseSlice.reducer,
    countryReducer: countrySlice.reducer,

    userReducer: userSlice.reducer,
    roleReducer: roleSlice.reducer,

    customerReducer: customerSlice.reducer,
    customerCategoryReducer: customerCategorySlice.reducer,
    acquisitionChannelReducer: acquisitionChannelSlice.reducer,
    customerReferenceTypeReducer: customerReferenceTypeSlice.reducer,

    productReducer: productSlice.reducer,
    productTypeReducer: productTypeSlice.reducer,
    measurementUnitReducer: measurementUnitSlice.reducer,
    productCategoryReducer: productCategorySlice.reducer,
    brandReducer: brandSlice.reducer,
    productPriceTypeReducer: productPriceTypeSlice.reducer,
    productCostTypeReducer: productCostTypeSlice.reducer,
    propertyReducer: propertySlice.reducer,
    variantReducer: variantSlice.reducer,

    paymentTermReducer: paymentTermSlice.reducer,
});