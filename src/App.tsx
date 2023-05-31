import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Customer from "./pages/customers";
import Product from "./pages/products";
import User from "./pages/users";
import Currency from "./pages/currencies";
import CustomerCategory from "./pages/customer-categories";
import AcquisitionChannel from "./pages/acquisition-channels";
import CustomerReferenceType from "./pages/customer-reference-types";
import MeasurementUnit from "./pages/measurement-units";
import ProductCategory from "./pages/product-categories";
import Brand from "./pages/brands";
import Property from "./pages/properties";
import Warehouse from "./pages/warehouses";
import Variant from "./pages/variants";
import ProductPriceType from "./pages/product-price-types";
import ProductCostType from "./pages/product-cost-types";
import Business from "./pages/businesses";
import Establishment from "./pages/establishments";
import Sale from "./pages/sales";
import AccountReceivable from "./pages/accounts-receivable";
import CustomerPayment from "./pages/customer-payments";
import Suppliers from "./pages/suppliers";
import Purchase from "./pages/purchases";
import AccountPayable from "./pages/accounts-payable";
import SupplierPayment from "./pages/supplier-payments";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={ <h3>Tenant Login</h3> }></Route>
      <Route path="/" element={ <Navigate to="/login" /> }></Route>
      <Route path="/">
        <Route path=":tenantDomain">
          <Route index element={ <Home/> } />
          <Route path="login" element={ <Login/> } />
          <Route path="customers" element={ <Customer/> } />
          <Route path="sales" element={ <Sale/> } />
          <Route path="accounts-receivable" element={ <AccountReceivable/> } />
          <Route path="customer-payments" element={ <CustomerPayment/> } />
          <Route path="suppliers" element={ <Suppliers/> } />
          <Route path="purchases" element={ <Purchase/> } />
          <Route path="accounts-payable" element={ <AccountPayable/> } />
          <Route path="supplier-payments" element={ <SupplierPayment/> } />
          <Route path="products" element={ <Product/> } />
          <Route path="users" element={ <User/> } />
          <Route path="configuration/currencies" element={ <Currency/> } />
          <Route path="configuration/businesses" element={ <Business/> } />
          <Route path="configuration/establishments" element={ <Establishment/> } />
          <Route path="configuration/warehouses" element={ <Warehouse/> } />
          <Route path="configuration/customers/categories" element={ <CustomerCategory/> } />
          <Route path="configuration/customers/acquisition-channels" element={ <AcquisitionChannel/> } />
          <Route path="configuration/customers/reference-types" element={ <CustomerReferenceType/> } />
          <Route path="configuration/products/categories" element={ <ProductCategory/> } />
          <Route path="configuration/products/brands" element={ <Brand/> } />
          <Route path="configuration/products/price-types" element={ <ProductPriceType/> } />
          <Route path="configuration/products/cost-types" element={ <ProductCostType/> } />
          <Route path="configuration/products/measurement-units" element={ <MeasurementUnit/> } />
          <Route path="configuration/products/properties" element={ <Property/> } />
          <Route path="configuration/products/variants" element={ <Variant/> } />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
