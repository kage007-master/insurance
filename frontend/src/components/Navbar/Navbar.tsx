import { VscVmActive } from "react-icons/vsc";
import { LuLogOut } from "react-icons/lu";
import { AiOutlineHistory, AiOutlineCloseSquare } from "react-icons/ai";
import { CiSquareChevRight } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { BiLogoInternetExplorer } from "react-icons/bi";
import { TiWeatherCloudy } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logOut } from "../../store/auth";
import { useState } from "react";
import { HiUsers } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io"
import Logo from "../Logo"

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="flex items-center md:hidden">
        <button
          className="absolute left-0 bg-[#031C30] text-white py-5 px-1 z-50"
          onClick={() => setOpen(true)}
        >
          <CiSquareChevRight className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`${open ? "flex absolute h-full" : "hidden"
          } z-20 md:flex min-w-[250px] max-w-[250px] p-4  flex-col gap-4 border bg-[#031C30] text-white`}
      >
        <div className="flex justify-center flex-col items-center gap-2 mt-4 mb-8 relative">
          <Logo className={""} />
          {user.role !== "employee" && <h2 className="text-xl">{user.address?.city}</h2>}
          <button
            className="md:hidden absolute top-0 right-0 bg-[#031C30] text-white"
            onClick={() => setOpen(false)}
          >
            <AiOutlineCloseSquare className="w-6 h-6" />
          </button>
        </div>
        {user.role === "customer" ? (
          <>
            <NavLink to="/customer/active-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1 text-red" />
              Active Claims
            </NavLink>
            <NavLink to="/customer/past-claims" className="navbar-item">
              <AiOutlineHistory className="w-6 h-6 m-1" />
              Past Claims
            </NavLink>
            <NavLink to="/customer/coverages" className="navbar-item">
              <TiWeatherCloudy className="w-6 h-6 m-1" />
              Coverages
            </NavLink>
          </>
        ) : user.role === "employee" ? (
          <>
            <NavLink to="/employee/claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              Claims
            </NavLink>
            <NavLink to="/employee/clients" className="navbar-item">
              <HiUsers className="w-6 h-6 m-1" />
              Clients
            </NavLink>
            <NavLink to="/employee/coverages" className="navbar-item">
              <TiWeatherCloudy className="w-6 h-6 m-1" />
              Coverages
            </NavLink>
            <NavLink to="/employee/validators" className="navbar-item">
              <FaUserShield className="w-6 h-6 m-1" />
              Validators
            </NavLink>
            <NavLink to="/employee/statistics" className="navbar-item">
              <IoIosStats className="w-6 h-6 m-1" />
              Statistics
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/validator/assigned-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              Assigned Claims
            </NavLink>
            <NavLink to="/validator/assessed-claims" className="navbar-item">
              <VscVmActive className="w-6 h-6 m-1" />
              Assessed Claims
            </NavLink>
          </>
        )}

        {user.role !== "validator" && (
          <button className="navbar-item">
            <BiLogoInternetExplorer className="w-6 h-6 m-1" />
            Explorer
          </button>
        )}
        <button
          className="mt-auto navbar-item"
          onClick={() => {
            dispatch(logOut());
          }}
        >
          <LuLogOut className="w-6 h-6 m-1" />
          Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
