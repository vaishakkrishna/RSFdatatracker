import React, { Component } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { initAndGetFirebaseDB } from "../utils/init_firebase";
import { ref, onValue } from "firebase/database";
import { colorsOfTheWeek } from "../utils/constants";
import { daysOfTheWeek } from "../utils/constants";
function LineChart(props) {
	const daysOfTheWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];
	const db = initAndGetFirebaseDB();
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	var allDaysDataObject;
	var allDaysData = [];
	var data;
	const dayRef = ref(db, "byday");
	onValue(dayRef, (snapshot) => {
		allDaysData = snapshot.val();
		console.log(allDaysData)
		data = putDataIntoDS(allDaysData);
	});

	// // returns 3-d array where arr[i] is the data for the ith day
	// // arr[i][0] is the x-axis data for the ith day
	// // arr[i][1] is the y-axis data for the ith day
	// function getAllDaysDataFromObject(allDaysObj) {
	// 	var allDaysData = [];
	// 	for (var day in allDaysObj) {
	// 		var dayData = allDaysObj[day];
	// 		var dayDataArray = [];
	// 		var dayDataArrayX = [];
	// 		var dayDataArrayY = [];
	// 		for (var index in dayData) {
	// 			dayDataArrayX.push(dayData[index]["Date"]);
	// 			dayDataArrayY.push(dayData[index]["Weight Rooms"]);
	// 		}
	// 		dayDataArray.push(dayDataArrayX);
	// 		dayDataArray.push(dayDataArrayY);
	// 		allDaysData.push(dayDataArray);
	// 	}
	// 	return allDaysData;
	// }

	const dayOfTheWeek = props.day;

	//log the data
	// console.log(csv_data);
	const options = {
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
	};
	function putDataIntoDS(allDaysData){
		var datasets = [];
		for (var day in allDaysData) {
			var dayData = allDaysData[day];
			datasets.push({
				label: day,
				data: dayData,
				parsing: {
					xAxisKey: 'Date',
					yAxisKey: 'Weight Rooms'
				}
			})
		}
		var data = {
			labels: daysOfTheWeek,
			datasets: datasets,
		}
		return data;
	}
	

	// // define datasets
	// const data = allDaysData.map((dayData, ind) => {
	// 	return {
	// 		label: daysOfTheWeek[ind],
	// 		data: dayData,
	// 		fill: false,
	// 		borderColor: colorsOfTheWeek[ind],
	// 		tension: 0.1,
	// 	};
	// });

	return (
		<div>
			<Line options={options} data={data} />
		</div>
	);
}
export default LineChart;
