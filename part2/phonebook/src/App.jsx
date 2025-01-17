import { useState } from 'react'
import './App.css'
import { Persons } from './Components/Persons'
import { Filter } from './Components/Filter'
import { PersonForm } from './Components/PersonForm'
import { useEffect } from 'react'
import servicesPerson from './services/persons'


const Notification = ({ message }) =>{
  if(message === null){
    return null
  }
  return (
    <div className='notif'>
      {message}
    </div>
  )
}


function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [personSearch, setPersonSearch] = useState([])
  const [notifMessage, setNotifMessage] = useState(null)

  useEffect(()=>{
    // console.log('effect')
    servicesPerson
      .getAll()
      .then(initialPersons=>{
        console.log('promise fulfilled')

        setPersons(initialPersons)
      })
  }, [])
  // console.log('render', persons.length, 'persons')

  const handleChangeName = event =>{
    setNewName(event.target.value)
  }
  const handleChangeNumber = event =>{
    setNewNumber(event.target.value)
  }

  const handleChangeSearch = event =>{
    setSearch(event.target.value)
    const fillSearch = persons.filter(person => person.name.toLowerCase().indexOf(search)>-1)
    console.log(fillSearch)
    setPersonSearch(fillSearch)
  }
  const addPersons = event =>{
    event.preventDefault()
    const personObj = {name: newName, number: newNumber}
    
    if(persons.find(p=>p.name === newName)){
      const personId = persons.find(p => p.name === newName).id
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        servicesPerson
          .update(personId, personObj)
          .then(returnedPerson=>{
            setPersons(persons.map(p=>p.name === newName ? returnedPerson : p))
            setNotifMessage(`Changed ${newName} number`)
            setNewName('')
            setNewNumber('')
            setTimeout(()=>{setNotifMessage(null)},3000)
          }).catch(error=>{
            setNotifMessage(`Information of ${newName} has already been removed from the server`)
            setPersons(persons.filter(p=>p.id !== personId))
            setNewName('')
            setNewNumber('')
            setTimeout(()=>{setNotifMessage(null)},3000)
          })
        }
      }else{
        servicesPerson
        .create(personObj)
        .then(returnedPerson=>{
          setPersons(persons.concat(returnedPerson))
          setNotifMessage(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
          setTimeout(()=>{setNotifMessage(null)},3000)
        })
      
      
    }
    
  }

  const handleDelete = id =>{
    const deletedName = persons.filter(p=>p.id === id)[0].name
    if (window.confirm(`Delete ${deletedName} ?`)){
      servicesPerson
        .deleteById(id)
        .then(deletedPerson=>{
          setPersons(persons.filter(p=>p.id !== deletedPerson.id))
      })}
  }

  return(
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage}/>
      <Filter search={search} handleChangeSearch={handleChangeSearch} />
      <h2>add a new</h2>
      <PersonForm addPersons={addPersons} newName={newName} newNumber={newNumber} handleChangeName={handleChangeName} handleChangeNumber={handleChangeNumber} />
      <h2>Numbers</h2>
      <Persons 
        persons = {persons} 
        search = {search} 
        personSearch={personSearch} 
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App
