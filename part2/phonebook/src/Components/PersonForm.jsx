import React from 'react'

export const PersonForm = ({addPersons, newName, newNumber, handleChangeName, handleChangeNumber}) => {
  return (
    <div>
        <form onSubmit={addPersons}>
        <div>
          name: <input value={newName} onChange={handleChangeName}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleChangeNumber}/>
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </div>
  )
}
