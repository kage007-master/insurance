import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { HiUser, HiHome } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

type Title = "active-claims" | "past-claims" | "profile" | "coverages" | "404";

const titles = {
  "active-claims": "Active Claims",
  "past-claims": "Past Claims",
  "assessed-claims": "Assessed Claims",
  "assigned-claims": "Assigned Claims",
  profile: "Profile",
  coverages: "Coverages",
  claims: "Claims",
  clients: "Clients",
  validators: "Validators",
  "404": "404",
};

const Toolbar: React.FC = () => {
  const location = useLocation();
  const path = (location.pathname.split("/").reverse().at(0) ?? "404") as Title;
  const searchFor = path.split("-").reverse().at(0);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="m-4 border flex justify-between p-4 rounded-2xl items-center text-black">
      <Breadcrumbs aria-label="breadcrumb">
        <HiHome />
        <p>{titles[path]}</p>
      </Breadcrumbs>
      <div className="flex gap-2 items-center">
        {searchFor !== "profile" && (
          <Input
            prefix={<SearchOutlined className="site-form-item-icon" />}
            className="rounded-full"
            placeholder={`Search for ${searchFor}`}
          />
        )}
        {user.role !== "employee" && (
          <Link to={`/${user.role}/profile`}>
            <HiUser className="w-6 h-6" />
          </Link>
        )}
        <IoSettingsSharp className="w-6 h-6" />
        <IoIosNotifications className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Toolbar;
