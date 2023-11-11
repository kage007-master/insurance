import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { Row, Col, Table } from "antd";
import { FaFileCircleXmark, FaClipboardList } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import { PiFilePdf } from "react-icons/pi";
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
    report.setFont("Droid Sans");
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

  const currentDate = new Date();

  // Get the individual components of the date
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = currentDate.getDate().toString().padStart(2, "0");

  return (
    <Layout>
      <>
        <div style={{ opacity: 0 }}>
          <div
            id="report"
            className="absolute w-[500px]"
            style={{ fontFamily: "Droid Sans" }}
          >
            <img
              src="/images/logo.png"
              alt="logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 50,
                height: 50,
              }}
            />
            <p
              style={
                {
                  fontSize: "27px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "100%",
                  textWrap: "nowarp",
                  marginLeft: 40,
                } as any
              }
            >
              Claims & Subscriptions Report
            </p>
            <div style={{ position: "absolute", left: 0, top: 50 }}>
              <p>Total Claims: {claim?.total}</p>
              <p>Approved Claims: {claim?.approved}</p>
              <p>Declined Claims: {claim?.declined}</p>
            </div>
            <h3
              style={{
                fontSize: "22px",
                textAlign: "center",
                marginTop: 85,
                fontWeight: "bold",
              }}
            >
              Claims Overview {"(" + new Date().getFullYear() + ")"}
            </h3>
            <table className="w-full" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {claims_overview &&
                    claims_overview.columns.map((item: any, index: number) => (
                      <th key={index}>{item.title}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {claims_overview &&
                    claims_overview.columns.map((item: any, index: string) => {
                      return <td>{claims_overview.data[0][item.dataIndex]}</td>;
                    })}
                </tr>
              </tbody>
            </table>
            <br />
            <table style={{ width: "100%" }}>
              <tr>
                <td>
                  <h4
                    style={
                      {
                        fontSize: "20px",
                        textWrap: "nowrap",
                        fontWeight: "bold",
                      } as any
                    }
                  >
                    Subscriptions per Coverage
                  </h4>
                  <br></br>
                  {coverage &&
                    coverage.map((item: any) => (
                      <>
                        <table>
                          <tr aria-colspan={2}>
                            <td
                              style={{
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              Subscriptions
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              {item.subscriptions}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              Revenue
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              {item.revenue}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              Expenditure
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                textAlign: "left",
                              }}
                            >
                              {item.expenditure}
                            </td>
                          </tr>
                        </table>
                        <br />
                      </>
                    ))}
                </td>
                <td style={{ width: "2px", backgroundColor: "black" }}></td>
                <td style={{ paddingLeft: "10px" }}>
                  <h4
                    style={
                      {
                        fontSize: "20px",
                        textWrap: "nowrap",
                        fontWeight: "bold",
                      } as any
                    }
                  >
                    Subscriptions per City
                  </h4>
                  <br></br>
                  {city &&
                    Object.keys(city).map((area: string) => (
                      <>
                        <table
                          style={{ borderCollapse: "collapse", width: "100%" }}
                        >
                          <tr>
                            <td
                              style={{
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              {area}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              Subscriptions
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              {city[area].subscriptions}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              Revenue
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              {city[area].revenue}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              Expenditure
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "0 5px 7px 5px",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              {city[area].expenditure}
                            </td>
                          </tr>
                        </table>
                        <br />
                      </>
                    ))}
                </td>
              </tr>
            </table>
            <div
              style={{ fontSize: "10px", color: "gray", textAlign: "right" }}
            >
              <p>{`${year} /${month} /${day}`}</p>
              <p>{`WeatherChain 2023`}</p>
            </div>
          </div>
        </div>
        <div className="relative -mt-6">
          <div className="absolute top-0 right-0 float-right flex gap-2">
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
                  <FaClipboardList className="w-12 h-12" />
                  <p className="p-2">Total Claims</p>
                  <div className="border w-full"></div>
                  <p className="p-2">{claim?.total}</p>
                </div>
              </div>
            </Col>
            <Col span={12} md={8}>
              <div className="flex justify-center h-full">
                <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                  <TbChecklist className="w-12 h-12" />
                  <p className="p-2">Approved Claims</p>
                  <div className="border w-full"></div>
                  <p className="p-2">{claim?.approved}</p>
                </div>
              </div>
            </Col>
            <Col span={12} md={8}>
              <div className="flex justify-center h-full">
                <div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
                  <FaFileCircleXmark className="w-12 h-12" />
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
