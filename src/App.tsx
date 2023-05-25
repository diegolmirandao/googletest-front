import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/login" element={ <Login/> } />
      <Route path="/users" element={ <User/> } />
      <Route path="/customers" element={ <Customer/> } />
      <Route path="/products" element={ <Product/> } />
      <Route path="/configuration/currencies" element={ <Currency/> } />
      <Route path="/configuration/businesses" element={ <Business/> } />
      <Route path="/configuration/warehouses" element={ <Warehouse/> } />
      <Route path="/configuration/customers/categories" element={ <CustomerCategory/> } />
      <Route path="/configuration/customers/acquisition-channels" element={ <AcquisitionChannel/> } />
      <Route path="/configuration/customers/reference-types" element={ <CustomerReferenceType/> } />
      <Route path="/configuration/products/categories" element={ <ProductCategory/> } />
      <Route path="/configuration/products/brands" element={ <Brand/> } />
      <Route path="/configuration/products/price-types" element={ <ProductPriceType/> } />
      <Route path="/configuration/products/cost-types" element={ <ProductCostType/> } />
      <Route path="/configuration/products/measurement-units" element={ <MeasurementUnit/> } />
      <Route path="/configuration/products/properties" element={ <Property/> } />
      <Route path="/configuration/products/variants" element={ <Variant/> } />
    </Routes>
  )
}

export default App
