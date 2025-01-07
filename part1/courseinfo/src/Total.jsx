import React from 'react'

export const Total = (props) => {
    let sum = 0
    props.parts.forEach(part=>sum+=part.exercises)
  return (
    <p>Number of exercises {sum}</p>
  )
}
