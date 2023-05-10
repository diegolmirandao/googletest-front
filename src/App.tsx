import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/users";
import CustomerCategory from "./pages/customer-categories";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/login" element={ <Login/> } />
      <Route path="/users" element={ <User/> } />
      <Route path="/configuration/customers/categories" element={ <CustomerCategory/> } />
    </Routes>
  )
}

export default App
