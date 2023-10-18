import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";

import ActiveClaims from "./pages/customer/ActiveClaims";
import Coverages from "./pages/customer/Coverages";
import PastClaims from "./pages/customer/PastClaims";
import CustomerProfile from "./pages/customer/Profile";
import EmployeeCoverages from "./pages/employee/Coverages";
import Claims from "./pages/employee/Claims";
import Clients from "./pages/employee/Clients";
import Validators from "./pages/employee/Validators";
import AssignedClaims from "./pages/validator/AssignedClaims";
import AssessedClaims from "./pages/validator/AssessedClaims";
import ValidatorProfile from "./pages/validator/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./store/auth";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    dispatch(loadUser());
  }, []);

  return (
    <div className="App flex h-screen">
      <Router>
        <Routes>
          {user.role === "customer" ? (
            <>
              <Route
                path="/customer/active-claims"
                element={<ActiveClaims />}
              />
              <Route path="/customer/coverages" element={<Coverages />} />
              <Route path="/customer/past-claims" element={<PastClaims />} />
              <Route path="/customer/profile" element={<CustomerProfile />} />
              <Route
                path="*"
                element={<Navigate to="/customer/active-claims" />}
              />
            </>
          ) : user.role === "employee" ? (
            <>
              <Route
                path="/employee/coverages"
                element={<EmployeeCoverages />}
              />
              <Route path="/employee/claims" element={<Claims />} />
              <Route path="/employee/clients" element={<Clients />} />
              <Route path="/employee/validators" element={<Validators />} />
              <Route path="*" element={<Navigate to="/employee/claims" />} />
            </>
          ) : user.role === "validator" ? (
            <>
              <Route
                path="/validator/assigned-claims"
                element={<AssignedClaims />}
              />
              <Route
                path="/validator/assessed-claims"
                element={<AssessedClaims />}
              />
              <Route path="/validator/profile" element={<ValidatorProfile />} />
              <Route
                path="*"
                element={<Navigate to="/validator/assigned-claims" />}
              />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
