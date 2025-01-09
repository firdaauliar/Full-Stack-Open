import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Statistics from './Statistics';

import React from 'react'


const Button = ({handleClick, text}) =>{
  return(
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = ()=>setGood(good+1)
  const handleClickNeutral = ()=>setNeutral(neutral+1)
  const handleClickBad = ()=>setBad(bad+1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleClickGood} text="good"/>
      <Button handleClick={handleClickNeutral} text="neutral"/>
      <Button handleClick={handleClickBad} text="bad"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}



export default App;
