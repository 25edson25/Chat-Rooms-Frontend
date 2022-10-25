import Login from "./pages/login";
import Register from "./pages/register/index"
import Rooms from "./pages/rooms";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useState } from "react";
import UserContext from "./context/user"

function App() {
  
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path="/register" element={
            user?
              <Navigate to='/rooms'/>:
              <Register/>
          }/>
          <Route path="/login" element={
            user?
              <Navigate to='/rooms'/>:
              <Login/>
          }/>
          <Route path="/rooms" element={<Rooms/>}/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
