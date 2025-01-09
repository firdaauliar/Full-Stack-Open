import React from 'react'


const StatisticLine = ({text, value}) => {
    return(
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}


const Statistics = ({good, neutral, bad}) => {
    const all = bad+neutral+good
    const avg = all/3
    const positive = (all/good)*100
    if(good ===0 && bad ===0 && neutral ===0){
        return(
            <div>
                <h2>Statistics</h2>
                <p>No feedback given</p>
            </div>
        )
    }
  return (
    <div>
        <h2>Statistics</h2>
        <table>
            <tbody>        
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={all} />
                <StatisticLine text="average" value={avg} />
                <StatisticLine text="positive (%)" value={positive} />
            </tbody>
        </table>
    </div>
  )
}

export default Statistics
