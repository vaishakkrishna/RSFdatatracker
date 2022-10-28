
import './App.css'
import 'd3'
import DayAverageLineChart from './Components/DayAverageLineChart';
import Form from 'react-bootstrap/Form'
import React, { Component } from 'react';
import { daysOfTheWeek } from './utils/constants';
import {useState, useEffect} from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  let res = {
    width,
    height
  };
  console.log(res)
  return res;
}



function App() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [days, setDays] = React.useState(daysOfTheWeek.reduce((a, v) => ({ ...a, [v]: true}), {}) );
  const [padding, setPadding] = React.useState(windowDimensions["width"]*0.05);
  // convert the csv file to object form

  // function for on change event of selector
  const handleChange = (e) => {
    // get the value of the selected option
    const value = e.target.value;
    // create a copy of the object
    const copy = { ...days };
    copy[value] = !copy[value];
    setDays(copy)
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App">
      <h1 className='title'>RSF Crowd Meter Data</h1>

      <DayAverageLineChart days={days} width={Math.max(windowDimensions["width"], 600)} height={Math.max(windowDimensions["width"]/2, 350) }/>
      <div className='selector'>
      {
        daysOfTheWeek.map((day)=>{
          return <Form.Check 
          className='form-check'
          type="checkbox"
          label={day}
          name="formHorizontalRadios"
          id={day}
          value={day}
          key={day}
          onChange={(e) => handleChange(e)}
          defaultChecked={true}
        />
        })
      }
      </div>
    </div>
  );

  
}

export default App;
