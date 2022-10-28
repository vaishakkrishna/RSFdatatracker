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
	Label,
} from "recharts";
import "./DayAverageLineChart.css";
import { initAndGetFirebaseDB } from "../utils/init_firebase";
import { ref, onValue } from "firebase/database";
import { colorsOfTheWeek } from "../utils/constants";
import { daysOfTheWeek } from "../utils/constants";
function DayAverageLineChart(props) {
	const [minutesGrain, setMinutesGrain] = React.useState(20);
	const [data, setData] = React.useState();
	const [rawData, setRawData] = React.useState();
	const [options, setOptions] = React.useState();

	const dayOfTheWeek = props.day;

	function mean(array) {
		return array.reduce((a, b) => a + b) / array.length;
	}

	function processData(allDaysData) {
		let series = [];

		// convert dates in dataset from epoch to date
		for (let day in allDaysData) {
			let newDayDataSeries = {};
			let newDayData = [];
			for (let index in allDaysData[day]) {
				const rounded =
					Math.round(
						allDaysData[day][index]["Date"] / 1000 / 60 / props.samplingInterval
					) *
					props.samplingInterval *
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
			series.push({
				name: day,
				data: newDayData,
			});
		}
		series = series.sort((a, b) => {
			return daysOfTheWeek.indexOf(a.name) - daysOfTheWeek.indexOf(b.name);
		});
		// find the average weighroom crowd level in every 20 minute interval
		console.log(series);
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
			setRawData(snapshot.val());
			const rd = snapshot.val();

			setData(processData(rd));
		});
	}, []);

	useEffect(() => {
		setData(processData(rawData));
	}, [props.samplingInterval]);

	return (
		<div className="DayAverageChart">
			<LineChart
				width={props.width || 500}
				height={props.height || 300}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 10,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="Date"
					type="category"
					allowDuplicatedCategory={false}
					tick={{ fill: "white" }}
				>
					<Label
						value="Time"
						position="insideBottom"
						offset={-10}
						fill="white"
					/>
				</XAxis>

				<YAxis dataKey="Weight Rooms" tick={{ fill: "white" }}>
					<Label
						value="% Full"
						angle="-90"
						position="insideLeft"
						fill="white"
					/>
				</YAxis>
				<Tooltip />

				<Legend verticalAlign="top" />
				{data &&
					data.map(
						(s) =>
							props.days[s.name] && (
								<Line
									type="monotone"
									dataKey="Weight Rooms"
									data={s.data}
									name={s.name}
									key={s.name}
									stroke={colorsOfTheWeek[s.name]}
									strokeWidth={2}
									radius={1}
									dot={false}
									isAnimationActive={props.animate}
								/>
							)
					)}
			</LineChart>
		</div>
	);
}
export default DayAverageLineChart;
