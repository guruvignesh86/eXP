import { Navigate } from "react-router-dom";
import { useAuth } from './Authentic';
import { AuthContext } from "./Authentic";
// import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return isAuthenticated ? children : <Navigate to="/access-denied" />; 
  }

  return children;
};

export default ProtectedRoute;
  // const{isAuthenticated} = useContext(AuthContext);