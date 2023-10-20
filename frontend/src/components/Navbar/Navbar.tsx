import logo from "../../logo.svg";
import { VscVmActive } from "react-icons/vsc";
import { LuLogOut } from "react-icons/lu";
import { AiOutlineHistory } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogoInternetExplorer } from "react-icons/bi";
import { TiWeatherCloudy } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logOut } from "../../store/auth";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className="w-[100px] md:w-[300px] p-4 flex flex-col gap-4 border bg-[#031C30] text-white">
        <div className="flex justify-center md:justify-start items-center gap-2 mt-4 mb-8">
          <img src="/images/logo.png" alt="logo" className="w-12 h-12" />
          <p className="hidden md:block">Insurance</p>
        </div>
        {user.role === "customer" ? (
          <>
            <NavLink to="/customer/active-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1 text-red" />
              <p className="hidden md:block">Active Claims</p>
            </NavLink>
            <NavLink to="/customer/past-claims" className="navbar-item">
              <AiOutlineHistory className="w-6 h-6 m-1" />
              <p className="hidden md:block">Past Claims</p>
            </NavLink>
            <NavLink to="/customer/coverages" className="navbar-item">
              <TiWeatherCloudy className="w-6 h-6 m-1" />
              <p className="hidden md:block">Coverages</p>
            </NavLink>
          </>
        ) : user.role === "employee" ? (
          <>
            <NavLink to="/employee/claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Claims</p>
            </NavLink>
            <NavLink to="/employee/clients" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Clients</p>
            </NavLink>
            <NavLink to="/employee/coverages" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Coverages</p>
            </NavLink>
            <NavLink to="/employee/validators" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Validators</p>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/validator/assigned-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Assigned Claims</p>
            </NavLink>
            <NavLink to="/validator/assessed-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              <p className="hidden md:block">Assessed Claims</p>
            </NavLink>
          </>
        )}

        {user.role !== "validator" && (
          <button className="navbar-item">
            <BiLogoInternetExplorer className="w-6 h-6 m-1" />
            <p className="hidden md:block">Explorer</p>
          </button>
        )}
        <button
          className="mt-auto navbar-item"
          onClick={() => {
            dispatch(logOut());
          }}
        >
          <LuLogOut className="w-6 h-6 m-1" />
          <p className="hidden md:block">Logout</p>
        </button>
      </div>
    </>
  );
};

export default Navbar;
