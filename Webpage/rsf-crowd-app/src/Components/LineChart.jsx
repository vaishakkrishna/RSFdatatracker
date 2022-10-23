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
import Papa from "papaparse";


function LineChart(props) {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);
	Papa.parse("./data/Monday.csv", {
		header: true,
		skipEmptyLines: true,
		complete: function (results) {
		  console.log(results.data)
		},
	  });
	const dayOfTheWeek = props.day;
	var csv_rows = [];
  
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
				text: "Chart.js Line Chart",
			},
		},
	};
	var labels = []
	// // add labels in 20 minute intervals from 7am to 11pm
	for (var i = 7; i < 23; i++) {
		for (var j = 0; j < 60; j += 20) {
			labels.push(`${i}:${j}`);
		}
	}

	const data = {
		labels,
		datasets: [
			{
				label: "Monday",
				data: labels.map(() =>
					3),
				borderColor: 'rgb(53, 162, 235)',
      			backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	};
	return (
		<div>
			<Line options={options} data={data} />
		</div>
	);
}
export default LineChart;
