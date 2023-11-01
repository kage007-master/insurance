import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "../../utils/api";
import {
  Badge,
  Breadcrumb,
  Button,
  Input,
  InputNumber,
  Modal,
  Select,
  notification,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../utils/socket";
import {
  clearNotification,
  loadNotifications,
  setFilter,
} from "../../store/auth";

const { Option } = Select;

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
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(10);
  const [unit, setUnit] = useState("m");

  const { socket } = useContext(SocketContext);
  const [api, contextHolder] = notification.useNotification();
  const btn = (
    <Button type="default" danger size="small" onClick={() => api.destroy()}>
      Close All
    </Button>
  );

  const onSetting = async () => {
    if (user.role !== "employee") return;
    const { data: res } = await axios.get("/auth/settings");
    setDuration(res.duration);
    setUnit(res.unit);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = async () => {
    try {
      await axios.post("/auth/settings", { duration, unit });
      handleCancel();
    } catch (err) {
      console.log(err);
    }
  };

  const selectAfter = (
    <Select
      value={unit}
      onChange={(value) => setUnit(value)}
      style={{ width: 100 }}
    >
      <Option value="d">days</Option>
      <Option value="h">hours</Option>
      <Option value="m">mintues</Option>
    </Select>
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
        <Breadcrumb
          items={[
            {
              title: <HomeOutlined />,
            },
            {
              title: <p>{titles[path]}</p>,
            },
          ]}
        />
        {/* <Breadcrumbs aria-label="breadcrumb">
          <HiHome />
          <p>{titles[path]}</p>
        </Breadcrumbs> */}
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
          <IoSettingsSharp
            className="w-6 h-6 cursor-pointer"
            onClick={onSetting}
          />
          <Badge count={user.notifications}>
            <IoIosNotifications
              className="w-6 h-6"
              onClick={() => dispatch(loadNotifications())}
            />
          </Badge>
        </div>
      </div>
      <Modal
        open={open}
        title={"Settings"}
        onOk={onFinish}
        onCancel={handleCancel}
      >
        <InputNumber
          onChange={(value) => setDuration(value as number)}
          value={duration}
          addonBefore={<>Event Duration:</>}
          addonAfter={selectAfter}
        />
      </Modal>
    </div>
  );
};

export default Toolbar;
