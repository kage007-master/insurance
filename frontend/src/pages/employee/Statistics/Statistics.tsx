import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { Row, Col, Table } from "antd";
import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import { PiPrinter, PiFilePdf } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getStatistics } from "../../../store/statistic";
import ReactEcharts from "echarts-for-react";
import moment from "moment";
import type { ColumnsType } from "antd/es/table";
import JsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";

const Statistics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { claim, claims, coverage, city } = useSelector(
    (state: RootState) => state.statistic.data
  );
  const tableRef = useRef(null);
  const [claims_overview, setClaimsOverview] = useState<any>(null);
  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    bodyClass: "p-10 text-white -mt-12",
    content: () => componentRef.current,
  });
  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };
  const generatePDF = () => {
    const report = new JsPDF("portrait", "pt", "a4");
    report
      .html(document.querySelector("#report") as HTMLElement, {
        margin: [30, 20, 30, 20],
      })
      .then(() => {
        report.save("report.pdf");
      });
  };

  useEffect(() => {
    dispatch(getStatistics());
  }, []);

  useEffect(() => {
    if (claims?.length) {
      const getClaimsOverView = () => {
        const columns: ColumnsType = [];
        const data: any = [{ key: 1 }];
        const start = moment().startOf("month").subtract(11, "months");
        let total = 0;
        for (let i = 0; i < 12; i++) {
          columns.push({
            title: start.format("MMM"),
            dataIndex: start.format("MMM"),
            key: start.format("MMM"),
          });
          const end = moment(start);
          const cnt = claims.filter(
            (claim: any) =>
              moment(claim.date).isSameOrAfter(start) &&
              moment(claim.date).isSameOrBefore(end.endOf("month"))
          ).length;
          data[0][start.format("MMM")] = cnt;
          total += cnt;
          start.add(1, "months");
        }
        columns.push({ title: "Total", dataIndex: "total", key: "total" });
        data[0].total = total;
        return { columns, data };
      };
      setClaimsOverview(getClaimsOverView());
    }
  }, [claims]);

  return (
    <Layout>
      <>
        <div id="report" className="absolute">
          <p>Total Claims: {claim?.total}</p>
          <p>Approved Claims: {claim?.approved}</p>
          <p>Declined Claims: {claim?.declined}</p>
          {claims_overview !== null &&
            Object.keys(claims_overview.data[0]).map((index: string) => { return index !== "key" && (<p>{index}:{claims_overview.data[0][index]}</p>) })
          }
          {coverage && coverage.map((item: any) => (<><p>{item.name}</p><p>Subscriptions: {item.subscriptions}</p><p>Revenue: {item.revenue}</p><p>Expenditure: {item.expenditure}</p></>))}
          {city && Object.keys(city).map((area: string) => (<><p>{area}</p><p>Subscriptions: {city[area].subscriptions}</p><p>Revenue: {city[area].revenue}</p><p>Expenditure: {city[area].expenditure}</p></>))}
        </div>
        <div className="relative -mt-6">
          <div className="absolute top-0 right-0 float-right flex gap-2">
            <button
              onClick={handlePrint}
              className="h-[36px] border px-4 bg-[#18DDB1] rounded-md"
            >
              <PiPrinter className="w-6 h-6" />
            </button>
            <button
              onClick={generatePDF}
              className="h-[36px] border px-4 bg-[#18DDB1] rounded-md flex items-center gap-1"
            >
              Export To <PiFilePdf className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div ref={componentRef}>
          <Row className="pt-12" justify="space-around" gutter={[16, 16]}>
            <Col span={12} md={8}>
              <div className="flex justify-center h-full">
                <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                  <MdAccountBalance className="w-12 h-12" />
                  <p className="p-2">Total Claims</p>
                  <div className="border w-full"></div>
                  <p className="p-2">{claim?.total}</p>
                </div>
              </div>
            </Col>
            <Col span={12} md={8}>
              <div className="flex justify-center h-full">
                <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                  <BiNotepad className="w-12 h-12" />
                  <p className="p-2">Approved Claims</p>
                  <div className="border w-full"></div>
                  <p className="p-2">{claim?.approved}</p>
                </div>
              </div>
            </Col>
            <Col span={12} md={8}>
              <div className="flex justify-center h-full">
                <div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
                  <MdAccountBalance className="w-12 h-12" />
                  <p className="p-2">Declined Claims</p>
                  <div className="border w-full"></div>
                  <p className="p-2">{claim?.declined}</p>
                </div>
              </div>
            </Col>
          </Row>
          <div ref={tableRef}>
            <p className="mt-4 text-2xl text-[#000] text-center">
              Claims Overview
            </p>
            {claims_overview && (
              <Table
                className="mt-4"
                bordered
                columns={claims_overview.columns}
                dataSource={claims_overview.data}
                scroll={{ x: getWidth(tableRef) }}
                size="small"
              />
            )}
          </div>
          <>
            <Row gutter={[0, 0]} className="mt-5 text-left">
              <Col span={24} xl={12} className="p-4">
                <div className="">
                  {city && (
                    <ReactEcharts
                      option={{
                        title: {
                          text: "Subscriptions per Coverage",
                          left: "center",
                        },
                        tooltip: {
                          trigger: "item",
                        },
                        series: [
                          {
                            type: "pie",
                            radius: "50%",
                            data: coverage.map((item: any) => ({
                              value: item.subscriptions,
                              name: item.name,
                            })),
                          },
                        ],
                      }}
                      className=""
                    />
                  )}
                </div>
              </Col>
              <Col span={24} xl={12} className="p-4">
                {city && (
                  <ReactEcharts
                    option={{
                      title: {
                        text: "Revenue per Coverage",
                        left: "center",
                      },
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                      xAxis: {
                        type: "category",
                        data: coverage.map((item: any) => item.name),
                      },
                      yAxis: {
                        type: "value",
                      },
                      series: [
                        {
                          data: coverage.map((item: any) => item.revenue),
                          type: "bar",
                        },
                      ],
                    }}
                    className="h-[300px] xl:!h-[200px]"
                  />
                )}
                {city && (
                  <ReactEcharts
                    option={{
                      title: {
                        text: "Expenditure per Coverage",
                        left: "center",
                      },
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                      xAxis: {
                        type: "category",
                        data: coverage.map((item: any) => item.name),
                      },
                      yAxis: {
                        type: "value",
                      },
                      series: [
                        {
                          data: coverage.map((item: any) => item.expenditure),
                          type: "bar",
                        },
                      ],
                    }}
                    className="h-[300px] xl:!h-[200px]"
                  />
                )}
              </Col>
            </Row>
          </>
          <>
            <Row gutter={[0, 0]} className="mt-5 text-left">
              <Col span={24} xl={12} className="p-4">
                <div className="">
                  {city && (
                    <ReactEcharts
                      option={{
                        title: {
                          text: "Subscriptions per City",
                          left: "center",
                        },
                        tooltip: {
                          trigger: "item",
                        },
                        series: [
                          {
                            type: "pie",
                            radius: "50%",
                            data: Object.keys(city).map((area: string) => ({
                              value: city[area].subscriptions,
                              name: area,
                            })),
                          },
                        ],
                      }}
                      className=""
                    />
                  )}
                </div>
              </Col>
              <Col span={24} xl={12} className="p-4">
                {city && (
                  <ReactEcharts
                    option={{
                      title: {
                        text: "Revenue per City",
                        left: "center",
                      },
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                      xAxis: {
                        type: "category",
                        data: Object.keys(city),
                      },
                      yAxis: {
                        type: "value",
                      },
                      series: [
                        {
                          data: Object.keys(city).map(
                            (area: string) => city[area].revenue
                          ),
                          type: "bar",
                        },
                      ],
                    }}
                    className="h-[300px] xl:!h-[200px]"
                  />
                )}
                {city && (
                  <ReactEcharts
                    option={{
                      title: {
                        text: "Expenditure per City",
                        left: "center",
                      },
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                      xAxis: {
                        type: "category",
                        data: Object.keys(city),
                      },
                      yAxis: {
                        type: "value",
                      },
                      series: [
                        {
                          data: Object.keys(city).map(
                            (area: string) => city[area].expenditure
                          ),
                          type: "bar",
                        },
                      ],
                    }}
                    className="h-[300px] xl:!h-[200px]"
                  />
                )}
              </Col>
            </Row>
          </>
        </div>
      </>
    </Layout>
  );
};

export default Statistics;
