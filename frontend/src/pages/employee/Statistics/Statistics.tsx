import React, { useEffect } from "react";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getStatistics } from "../../../store/statistic";
import ReactEcharts from "echarts-for-react";

const Statistics: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	const { claim, coverage, city } = useSelector((state: RootState) => state.statistic.data);
	useEffect(() => {
		dispatch(getStatistics());
	}, [])

	return (
		<Layout>
			<>
				<Row justify="space-around" gutter={[16, 16]}>
					<Col span={12} md={8}>
						<div className="flex justify-center">
							<div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
								<MdAccountBalance className="w-12 h-12" />
								<p className="p-2">Total Claims</p>
								<div className="border w-full"></div>
								<p className="p-2">{claim?.total}</p>
							</div>
						</div>
					</Col>
					<Col span={12} md={8}>
						<div className="flex justify-center">
							<div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
								<BiNotepad className="w-12 h-12" />
								<p className="p-2">Approved Claims</p>
								<div className="border w-full"></div>
								<p className="p-2">{claim?.approved}</p>
							</div>
						</div>
					</Col>
					<Col span={12} md={8}>
						<div className="flex justify-center">
							<div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
								<MdAccountBalance className="w-12 h-12" />
								<p className="p-2">Declined Claims</p>
								<div className="border w-full"></div>
								<p className="p-2">{claim?.declined}</p>
							</div>
						</div>
					</Col>
				</Row>
				<>
					<Row gutter={[0, 64]} className="mt-5 text-left">
						<Col span={24} xl={12} className="p-4">
							<div className="">
								{city &&
									<ReactEcharts
										option={{
											title: {
												text: 'Subscriptions per Coverage',
												left: 'center'
											},
											tooltip: {
												trigger: 'item'
											},
											series: [
												{
													type: 'pie',
													radius: '50%',
													data: Object.keys(city).map((area: string) => ({ value: city[area].subscriptions, name: area })),
												}
											]
										}}
										className=""
									/>
								}
							</div>
						</Col>
						<Col span={24} xl={12} className="p-4">
							{city &&
								<ReactEcharts
									option={{
										title: {
											text: 'Revenue per Coverage',
											left: 'center'
										},
										xAxis: {
											type: 'category',
											data: Object.keys(city)
										},
										yAxis: {
											type: 'value'
										},
										series: [
											{
												data: Object.keys(city).map((area: string) => city[area].revenue),
												type: 'bar'
											}
										]
									}}
									className="!h-[200px]"
								/>
							}
							{city &&
								<ReactEcharts
									option={{
										title: {
											text: 'Expenditure per Coverage',
											left: 'center'
										},
										xAxis: {
											type: 'category',
											data: Object.keys(city)
										},
										yAxis: {
											type: 'value'
										},
										series: [
											{
												data: Object.keys(city).map((area: string) => city[area].expenditure),
												type: 'bar'
											}
										]
									}}
									className="!h-[200px]"
								/>
							}
						</Col>
					</Row>
				</>
				<>
					<Row gutter={[0, 64]} className="mt-5 text-left">
						<Col span={24} xl={12} className="p-4">
							<div className="">
								{city &&
									<ReactEcharts
										option={{
											title: {
												text: 'Subscriptions per City',
												left: 'center'
											},
											tooltip: {
												trigger: 'item'
											},
											series: [
												{
													type: 'pie',
													radius: '50%',
													data: Object.keys(city).map((area: string) => ({ value: city[area].subscriptions, name: area })),
												}
											]
										}}
										className=""
									/>
								}
							</div>
						</Col>
						<Col span={24} xl={12} className="p-4">
							{city &&
								<ReactEcharts
									option={{
										title: {
											text: 'Revenue per City',
											left: 'center'
										},
										xAxis: {
											type: 'category',
											data: Object.keys(city)
										},
										yAxis: {
											type: 'value'
										},
										series: [
											{
												data: Object.keys(city).map((area: string) => city[area].revenue),
												type: 'bar'
											}
										]
									}}
									className="!h-[200px]"
								/>
							}
							{city &&
								<ReactEcharts
									option={{
										title: {
											text: 'Expenditure per City',
											left: 'center'
										},
										xAxis: {
											type: 'category',
											data: Object.keys(city)
										},
										yAxis: {
											type: 'value'
										},
										series: [
											{
												data: Object.keys(city).map((area: string) => city[area].expenditure),
												type: 'bar'
											}
										]
									}}
									className="!h-[200px]"
								/>
							}
						</Col>
					</Row>
				</>
			</>
		</Layout>
	);
};

export default Statistics;
