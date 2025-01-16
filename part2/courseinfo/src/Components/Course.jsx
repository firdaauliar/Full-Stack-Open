import React from 'react'


const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <h4>total of {sum} exercises</h4>

const Part = ({ part}) => 
  <p key={part.id}>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part=><Part part={part} key={part.id}/>)}
  </>



const Course = ({ course })=>{
    const total_exercises = course.parts.reduce((sum, part)=>sum+=part.exercises,0)
    return(
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={total_exercises}/>
      </div>
    )
  }
export default Course