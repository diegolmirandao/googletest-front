import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/users";
import Currency from "./pages/currencies";
import CustomerCategory from "./pages/customer-categories";
import AcquisitionChannel from "./pages/acquisition-channels";
import Customer from "./pages/customers";
import CustomerReferenceType from "./pages/customer-reference-types";
import MeasurementUnit from "./pages/measurement-units";
import ProductCategory from "./pages/product-categories";
import Brand from "./pages/brands";
import Property from "./pages/properties";
import Warehouse from "./pages/warehouses";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/login" element={ <Login/> } />
      <Route path="/users" element={ <User/> } />
      <Route path="/customers" element={ <Customer/> } />
      <Route path="/configuration/currencies" element={ <Currency/> } />
      <Route path="/configuration/warehouses" element={ <Warehouse/> } />
      <Route path="/configuration/customers/categories" element={ <CustomerCategory/> } />
      <Route path="/configuration/customers/acquisition-channels" element={ <AcquisitionChannel/> } />
      <Route path="/configuration/customers/reference-types" element={ <CustomerReferenceType/> } />
      <Route path="/configuration/products/categories" element={ <ProductCategory/> } />
      <Route path="/configuration/products/brands" element={ <Brand/> } />
      <Route path="/configuration/products/measurement-units" element={ <MeasurementUnit/> } />
      <Route path="/configuration/products/properties" element={ <Property/> } />
    </Routes>
  )
}

export default App
