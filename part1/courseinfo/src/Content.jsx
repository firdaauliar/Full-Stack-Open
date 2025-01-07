import React from 'react'
import PropTypes from 'prop-types'

const Part = (props) =>{
    return(
        // <p>template</p>
        <p>{props.part} {props.exercises}</p>
    )
}


function Content(props) {
    // props.parts.forEach(part=>{console.log(part.exercises)})
    return (
        <div>
            {props.parts.map((part,i)=>
                <Part part={part.name} exercises={part.exercises} key={i}/>
            )}
        </div>
  )
}


export default Content
