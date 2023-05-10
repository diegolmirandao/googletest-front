import { combineReducers } from 'redux';
import authSlice from './auth';
import offline from './offline';
import init from './init';
import table from './table';
import userSlice from './user';
import roleSlice from './role';
import customerCategorySlice from './customerCategory';

export default combineReducers({
    authReducer: authSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    tableReducer: table.reducer,
    userReducer: userSlice.reducer,
    roleReducer: roleSlice.reducer,
    customerCategoryReducer: customerCategorySlice.reducer,
});