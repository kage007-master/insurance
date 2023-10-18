import { ReactElement } from "react";
import Navbar from "../Navbar";
import Toolbar from "../Toolbar";

interface Props {
  children: ReactElement;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="w-full m-2 text-white">
        <Toolbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
