import { combineReducers } from 'redux';
import authSlice from './auth';
import userSlice from './user';
import roleSlice from './role';
// import currencySlice from './currency';
// import businessSlice from './business';
// import businessServiceStatusSlice from './businessServiceStatus';
// import serviceSlice from './service';
// import billingCycleSlice from './billingCycle';
// import servicePriceTypeSlice from './servicePriceType';
// import featureSlice from './feature';
import offline from './offline';
import init from './init';
import table from './table';

export default combineReducers({
    authReducer: authSlice.reducer,
    userReducer: userSlice.reducer,
    roleReducer: roleSlice.reducer,
    // currencyReducer: currencySlice.reducer,
    // businessReducer: businessSlice.reducer,
    // businessServiceStatusReducer: businessServiceStatusSlice.reducer,
    // serviceReducer: serviceSlice.reducer,
    // billingCycleReducer: billingCycleSlice.reducer,
    // servicePriceTypeReducer: servicePriceTypeSlice.reducer,
    // featureReducer: featureSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    tableReducer: table.reducer,
});