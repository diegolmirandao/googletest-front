import { combineReducers } from 'redux';
import authSlice from './auth';
import offline from './offline';
import init from './init';
import tenant from './tenant';
import sync from './sync';
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
import paymentMethodSlice from './paymentMethod';
import documentTypeSlice from './documentType';

import saleSlice from './sale';
import accountReceivableSlice from './accountReceivable';
import customerPaymentSlice from './customerPayment';

import supplierSlice from './supplier';

import purchaseSlice from './purchase';
import accountPayableSlice from './accountPayable';
import supplierPaymentSlice from './supplierPayment';

import saleOrderStatusSlice from './saleOrderStatus';
import saleOrderSlice from './saleOrder';

export default combineReducers({
    authReducer: authSlice.reducer,
    offlineReducer: offline.reducer,
    initReducer: init.reducer,
    tenantReducer: tenant.reducer,
    syncReducer: sync.reducer,
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
    paymentMethodReducer: paymentMethodSlice.reducer,
    documentTypeReducer: documentTypeSlice.reducer,

    saleReducer: saleSlice.reducer,
    accountReceivableReducer: accountReceivableSlice.reducer,
    customerPaymentReducer: customerPaymentSlice.reducer,

    supplierReducer: supplierSlice.reducer,

    purchaseReducer: purchaseSlice.reducer,
    accountPayableReducer: accountPayableSlice.reducer,
    supplierPaymentReducer: supplierPaymentSlice.reducer,

    saleOrderStatusReducer: saleOrderStatusSlice.reducer,
    saleOrderReducer: saleOrderSlice.reducer,
});