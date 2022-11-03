import Login from "./pages/login";
import Register from "./pages/register/index"
import Rooms from "./pages/rooms";
import Room from "./pages/room/";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useState } from "react";
import UserContext from "./context/user"

function App() {
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path="/register" element={
            user?
              <Navigate to='/rooms'/>
            :
              <Register/>
          }/>
          <Route path="/login" element={
            user?
              <Navigate to='/rooms'/>
            :
              <Login/>
          }/>
          <Route path="/rooms" element={
            user?
              <Rooms/>
            :
              <Navigate to='/login'/>
          }/>
          <Route path='/room/:roomCode' element={
            user?
              user.room?
                <Room/>
              :
                <Navigate to='/rooms'/>
            :
              <Navigate to='/login'/>
          }/>
          <Route path='/' element={
            <Navigate  to='/login'/>
          }/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
