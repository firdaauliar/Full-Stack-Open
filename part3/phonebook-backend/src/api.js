// const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const serverless = require('serverless-http')


const app = express()

const router = express.Router()


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

// router.get('/',(request, response)=>response.send("<h1>Hello World</h1>"))

router.get('/persons', (request, response)=>{
    response.json(persons)
})

router.get('/info', (request, response)=>{
    let currentTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
})

router.get('/persons/:id',(request, response)=>{
    const personsId = request.params.id
    const person = persons.find(person=>person.id === personsId)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

router.delete('/persons/:id', (request, response)=>{
    const id = request.params.id
    persons = persons.filter(person=>person.id !== id)

    response.status(204).end()
})

router.post('/persons', (request, response)=>{
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

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
//   }
  
// app.use(unknownEndpoint)

app.use('/.netlify/functions/api/', router)

app.use(express.static('dist'))


module.exports.handler = serverless(app)

// const PORT = 3001

// app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))