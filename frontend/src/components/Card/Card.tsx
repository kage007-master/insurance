import React, { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-center h-full">
      <div className="relative border rounded-xl p-4 w-[500px] h-full bg-[#031C30]">
        {children}
      </div>
    </div>
  );
};

export default Card;
