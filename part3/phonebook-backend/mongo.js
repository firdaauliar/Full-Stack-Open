const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit()
}

const password = process.argv[2]


const url = `mongodb+srv://fauliarahma05:${password}@cluster0.oiuzv.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {console.log(`${person.name} ${person.number}`)})
        mongoose.connection.close()
    })
}else{
    const namePerson = process.argv[3]
    const numberPerson = process.argv[4]

    if(numberPerson){
        const person = new Person({
            name: namePerson,
            number: numberPerson
        })
        person.save().then(result=>{
            console.log(`added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        })
    }else{
        console.log("add number as argument")
        process.exit()
    }
}

// const person = new Person({
//     name: "Mary Poppendieck", 
//     number: "39-23-6423122"
// })

// person.save().then(result=>{
//     console.log('contact saved!!')
//     mongoose.connection.close()
// })

// Person.find({}).then(result => {
//     result.forEach(person => {console.log(person)})
//     mongoose.connection.close()
// })