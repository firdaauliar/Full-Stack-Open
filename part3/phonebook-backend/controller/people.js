const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/persons', (request, response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
  })
  
  peopleRouter.get('/info', (request, response) => {
    let currentTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
  })
  
  peopleRouter.get('/persons/:id',(request, response) => {
  
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
  
  peopleRouter.delete('/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        console.log(result)
        response.json(result)
        response.status(200)
        // response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  peopleRouter.post('/persons', (request, response, next) => {
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
  
  peopleRouter.put('/persons/:id', (request, response, next) => {
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
  

module.exports = peopleRouter