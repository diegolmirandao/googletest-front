import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/users";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/login" element={ <Login/> } />
      <Route path="/users" element={ <User/> } />
    </Routes>
  )
}

export default App
