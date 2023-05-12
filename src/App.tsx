import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/users";
import CustomerCategory from "./pages/customer-categories";
import AcquisitionChannel from "./pages/acquisition-channels";
import Customer from "./pages/customers";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/login" element={ <Login/> } />
      <Route path="/users" element={ <User/> } />
      <Route path="/customers" element={ <Customer/> } />
      <Route path="/configuration/customers/categories" element={ <CustomerCategory/> } />
      <Route path="/configuration/customers/acquisition-channels" element={ <AcquisitionChannel/> } />
    </Routes>
  )
}

export default App
