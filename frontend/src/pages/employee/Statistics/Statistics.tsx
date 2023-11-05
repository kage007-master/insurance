import React, { ReactElement } from "react";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";

const Statistics: React.FC = () => {
    return (
        <Layout><><Row justify="space-around" gutter={[16, 16]}>
            <Col span={12} md={8}>
                <div className="flex justify-center">
                    <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                        <MdAccountBalance className="w-12 h-12" />
                        <p className="p-2">Balance</p>
                        <div className="border w-full"></div>
                        <p className="p-2">+ {123}$</p>
                    </div>
                </div>
            </Col>
            <Col span={12} md={8}>
                <div className="flex justify-center">
                    <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                        <BiNotepad className="w-12 h-12" />
                        <p className="p-2">Total claims</p>
                        <div className="border w-full"></div>
                        <p className="p-2">{1123}</p>
                    </div>
                </div>
            </Col>
            <Col span={12} md={8}>
                <div className="flex justify-center">
                    <div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
                        <MdAccountBalance className="w-12 h-12" />
                        <p className="p-2">Coverages</p>
                        <div className="border w-full"></div>
                        <p className="p-2">{123}</p>
                    </div>
                </div>
            </Col>
        </Row></></Layout>
    );
};

export default Statistics;
