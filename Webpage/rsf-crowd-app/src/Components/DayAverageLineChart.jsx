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

	function mean(array) {
		return array.reduce((a, b) => a + b) / array.length;
	}

	function processData(allDaysData) {
		let series = [];
		let interval = 20;
		
		// convert dates in dataset from epoch to date
		for (let day in allDaysData) {
			let newDayDataSeries = {};
			let newDayData = [];
			for (let index in allDaysData[day]) {
				const rounded =
					Math.round(allDaysData[day][index]["Date"] / 1000 / 60 / interval) *
					interval *
					1000 *
					60;
				const roundedDateString = new Date(rounded).toTimeString();
				if (roundedDateString in newDayDataSeries) {
					newDayDataSeries[roundedDateString].push(
						allDaysData[day][index]["Weight Rooms"]
					);
				} else {
					newDayDataSeries[roundedDateString] = [
						allDaysData[day][index]["Weight Rooms"],
					];
				}
			}
			newDayDataSeries = Object.keys(newDayDataSeries)
				.sort()
				.reduce((obj, key) => {
					obj[key] = newDayDataSeries[key];
					return obj;
				}, {});

			for (let time in newDayDataSeries) {
				newDayData.push({
					Date: time.split(" ")[0],
					"Weight Rooms": mean(newDayDataSeries[time]),
				});
			}

			console.log(newDayData);
			series.push({
				name: day,
				data: newDayData,
			});
		}

		// find the average weighroom crowd level in every 20 minute interval

		return series;
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

			setData(processData(rawData));
		});
	}, []);

	return (
		<>
			<LineChart
				width={1000}
				height={500}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="Date" type="category" allowDuplicatedCategory={false} />
				<YAxis dataKey="Weight Rooms" />
				<Tooltip />
				<Legend />
				{/* <Line
						type="monotone"
						dataKey="Weight Rooms"
						stroke="#8884d8"
						activeDot={{ r: 3 }}
					/> */}
				{data &&
					data.map((s) => (
						<Line
							dataKey="Weight Rooms"
							data={s.data}
							name={s.name}
							key={s.name}
							stroke={colorsOfTheWeek[s.name]}
						/>
					))}
			</LineChart>
		</>
	);
}
export default DayAverageLineChart;
