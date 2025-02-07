// const { response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const serverless = require('serverless-http')
const Person = require('../models/person')

const app = express()

const router = express.Router()

app.use(cors())
// Or, allow only a specific origin like your frontend (http://localhost:5173):
// app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json())

// app.use(express.static('dist'))

morgan.token('body', (response) => {
  return JSON.stringify(response.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// morgan("tiny", {stream: (request, res)=>{return res.statusCode}})
// morgan(':method :url :status :res[content-length] - :response-time ms')

// router.get('/',(request, response)=>response.send("<h1>Hello World</h1>"))

router.get('/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

router.get('/info', (request, response) => {
  let currentTime = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
})

router.get('/persons/:id',(request, response) => {

  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log(error.name)
      next(error)
    })
})

router.delete('/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.json(result)
      response.status(200)
      // response.status(204).end()
    })
    .catch(error => next(error))
})

router.post('/persons', (request, response, next) => {
  const body = request.body
  // if(!body.name || !body.number){
  //     return response.status(400).json({
  //         error:"name or number is missing"
  //     })
  // }
  // else if(Person.find({name: body.name})){
  //     return response.status(409).json({
  //         error: "name must be unique"
  //     })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

router.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use('/.netlify/functions/api/', router)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

module.exports.handler = serverless(app)

// const PORT = 3001

// app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))