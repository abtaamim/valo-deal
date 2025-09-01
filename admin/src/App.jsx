import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../frontend/src/context/auth";

const App = () => {
  const [auth] = useAuth();

  if (auth === null) {
    return null; 
  }

  return auth.loggedIn ? <Outlet /> : <Navigate to="/signIn" />;
};

export default App;
