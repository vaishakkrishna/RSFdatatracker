import React, { useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

import { initAndGetFirebaseDB } from "../utils/init_firebase";
import { ref, onValue } from "firebase/database";
import { colorsOfTheWeek } from "../utils/constants";
import { daysOfTheWeek } from "../utils/constants";
function DayAverageLineChart(props) {
	const [minutesGrain, setMinutesGrain] = React.useState(20);
	const [data, setData] = React.useState();
	const [allData, setAllData] = React.useState();
	const [options, setOptions] = React.useState();

	const daysOfTheWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];


	const dayOfTheWeek = props.day;


	function processData(allDaysData) {
		// convert dates in dataset from epoch to date
		for (let day in allDaysData) {
			for (let index in allDaysData[day]) {
				var date = new Date(allDaysData[day][index]["Date"] );
				allDaysData[day][index]["Date"] = date;
			}
		}
		// find the average weighroom crowd level for each timestamp

		
		return allDaysData;
	}


	useEffect(() => {
		const db = initAndGetFirebaseDB();

		setOptions({
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
				title: {
					display: true,
					text: "RSF Crowd Data",
				},
			},
			parsing: {
				xAxisKey: "Date",
				yAxisKey: "Weight Rooms",
			},
		});
		const dayRef = ref(db, "byday");
		onValue(dayRef, (snapshot) => {
			const rawData = snapshot.val();
			console.log(rawData);
			setData(processData(rawData)["Wednesday"]);
		});
	}, []);

	return (
		<>
			<div>
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="Date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="Weight Rooms"
						stroke="#8884d8"
						activeDot={{ r: 3 }}
					/>
					{/* <Line type="monotone" dataKey="Weight Rooms" stroke="#82ca9d" /> */}
				</LineChart>
			</div>
		</>
	);
}
export default DayAverageLineChart;
