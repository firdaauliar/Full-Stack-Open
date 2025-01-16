import React from 'react'

export const Persons = ({ persons, search, personSearch, handleDelete }) => {
  return (
    <div>
        <ul>
            {!search 
            ? persons.map(person=><li key={person.id} >
              {person.name} {person.number}
              <button onClick={()=>handleDelete(person.id)}>Delete</button>
            </li>) 
            : personSearch.map(person=><li key={person.id} >
              {person.name} {person.number}
              <button onClick={()=>handleDelete(person.id)}>Delete</button>
            </li>)}
        </ul>
    </div>
  )
}
