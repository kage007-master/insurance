import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { HiUser, HiHome } from "react-icons/hi";
import { Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../utils/socket";
import {
  clearNotification,
  loadNotifications,
  setFilter,
} from "../../store/auth";

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
  const { notifications } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState("");

  const { socket } = useContext(SocketContext);
  const [api, contextHolder] = notification.useNotification();
  const btn = (
    <Button type="default" danger size="small" onClick={() => api.destroy()}>
      Close All
    </Button>
  );
  useEffect(() => {
    socket.on("notification", () => {
      dispatch(loadNotifications());
    });
    dispatch(setFilter(""));
    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    notifications?.map((msg: any) => {
      api.info({
        message: msg.title,
        description: msg.content,
        duration: 0,
        btn,
      });
      return null;
    });
    if (notifications?.length) dispatch(clearNotification());
  }, [notifications]);

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
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.code === "Enter") dispatch(setFilter(search));
              }}
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
              onClick={() => dispatch(loadNotifications())}
            />
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
