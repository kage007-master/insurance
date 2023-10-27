import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { HiUser, HiHome } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Input, notification } from "antd";
import { useContext, useEffect } from "react";
import { SocketContext } from "../../utils/socket";
import { loadNotifications } from "../../store/auth";

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
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const path = (location.pathname.split("/").reverse().at(0) ?? "404") as Title;
  const searchFor = path.split("-").reverse().at(0);
  const { user } = useSelector((state: RootState) => state.auth);

  const { socket } = useContext(SocketContext);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    socket.on("notification", () => {
      dispatch(loadNotifications(api));
    });
    return () => {
      socket.off("notification");
    };
  });

  return (
    <div className="absolute w-navbar p-4 text-black bg-white z-10">
      {contextHolder}
      <div className="border flex justify-between p-4 rounded-2xl items-center">
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
          <Badge count={user.notifications}>
            <IoIosNotifications
              className="w-6 h-6"
              onClick={() => dispatch(loadNotifications(api))}
            />
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
