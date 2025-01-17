// const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
// Or, allow only a specific origin like your frontend (http://localhost:5173):
// app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', (response)=>{
    return JSON.stringify(response.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

// morgan("tiny", {stream: (request, res)=>{return res.statusCode}})
// morgan(':method :url :status :res[content-length] - :response-time ms')

app.get('/',(request, response)=>response.send("<h1>Hello World</h1>"))

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/info', (request, response)=>{
    let currentTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
})

app.get('/api/persons/:id',(request, response)=>{
    const personsId = request.params.id
    const person = persons.find(person=>person.id === personsId)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    persons = persons.filter(person=>person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error:"name or number is missing"
        })
    }else if(persons.find(person=>person.name === body.name)){
        return response.status(409).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: Math.floor(Math.random()*101),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))