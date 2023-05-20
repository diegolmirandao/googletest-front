import { combineReducers } from 'redux';
import authSlice from './auth';
import offline from './offline';
import init from './init';
import countrySlice from './country';

import userSlice from './user';
import roleSlice from './role';

import customerSlice from './customer';
import customerCategorySlice from './customerCategory';
import acquisitionChannelSlice from './acquisitionChannel';
import customerReferenceTypeSlice from './customerReferenceType';

import measurementUnitSlice from './measurementUnit';
import productCategorySlice from './productCategory';

export default combineReducers({
    authReducer: authSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    countryReducer: countrySlice.reducer,

    userReducer: userSlice.reducer,
    roleReducer: roleSlice.reducer,

    customerReducer: customerSlice.reducer,
    customerCategoryReducer: customerCategorySlice.reducer,
    acquisitionChannelReducer: acquisitionChannelSlice.reducer,
    customerReferenceTypeReducer: customerReferenceTypeSlice.reducer,

    measurementUnitReducer: measurementUnitSlice.reducer,
    productCategoryReducer: productCategorySlice.reducer,
});