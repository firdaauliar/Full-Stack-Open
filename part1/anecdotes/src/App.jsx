import { useState } from 'react'
import React from 'react'
import './App.css'


const Button = ({ onClick, text})=>{
  return (
    <button onClick={onClick}> {text} </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(Array(anecdotes.length).fill(0))

  const handleSelected = (max, min) =>{
    const rand = Math.floor(Math.random() * (max-min)) + min
    console.log(rand)
    setSelected(rand)
  }
  const n = anecdotes.length
  const handleClickVote = ()=>{
    const voteArr = [...vote]
    voteArr[selected] += 1
    setVote(voteArr)
    console.log(vote)
  }

  const voteLargest = vote.indexOf(Math.max(...vote))

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {vote[selected]} vote</p>
      <Button  onClick={()=>handleSelected(anecdotes.length,0)} text="next anecdote"/>
      <Button  onClick={handleClickVote} text="vote"/>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[voteLargest]}</p>
      <p>has {vote[voteLargest]} vote</p>
    </div>
  )
}



export default App
