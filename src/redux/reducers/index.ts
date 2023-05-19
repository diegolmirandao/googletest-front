import { combineReducers } from 'redux';
import authSlice from './auth';
import offline from './offline';
import init from './init';
import userSlice from './user';
import countrySlice from './country';
import roleSlice from './role';
import customerSlice from './customer';
import customerCategorySlice from './customerCategory';
import acquisitionChannelSlice from './acquisitionChannel';
import customerReferenceTypeSlice from './customerReferenceType';

export default combineReducers({
    authReducer: authSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    userReducer: userSlice.reducer,
    roleReducer: roleSlice.reducer,
    countryReducer: countrySlice.reducer,
    customerReducer: customerSlice.reducer,
    customerCategoryReducer: customerCategorySlice.reducer,
    acquisitionChannelReducer: acquisitionChannelSlice.reducer,
    customerReferenceTypeReducer: customerReferenceTypeSlice.reducer,
});