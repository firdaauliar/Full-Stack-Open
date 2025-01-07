import { useState } from 'react'
import viteLogo from '/vite.svg'
import Header from './Header'
import Content from './Content'
import { Total } from './Total'


const App = () =>{
  const course = {
    name: "Half Stack Application Development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10
      },
      {
        name: 'Using Props to Pass Data',
        exercises: 7
      },
      {
        name: 'State of a Component',
        exercises: 14
      },
    ]
  }
  return(
    <div>
      <Header course = {course}/>
      <Content parts = {course.parts}/>
      <Total parts = {course.parts}/>
    </div>
  )

}

export default App
