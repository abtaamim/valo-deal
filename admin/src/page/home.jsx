import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../frontend/src/context/auth";

const Home = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setAuth({ user: null, token: null, loggedIn: false });
    localStorage.removeItem("auth");
    navigate("/signIn");
  };

 
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <button
          onClick={() => navigate("/users")}
          className={`text-left px-4 py-2 rounded mt-2 transition ${
            isActive("/users") ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          User
        </button>

        <button
          onClick={() => navigate("/products")}
          className={`text-left px-4 py-2 rounded mt-2 transition ${
            isActive("/products") ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => navigate("/create-offer")}
          className={`text-left px-4 py-2 rounded mt-2 transition ${isActive("/create-offer") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
        >
          Create Offer
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`text-left px-4 py-2 rounded mt-2 transition ${
            isActive("/orders") ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Orders
        </button>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
