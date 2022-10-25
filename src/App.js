import Login from "./pages/login";
import Register from "./pages/register/index"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState } from "react";
import UserContext from "./context/user"

function App() {
  
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
