const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async()=>{
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

})
describe('when there is initially one user in db', ()=>{
    test('creation succeeds with a fresh username', async()=>{
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'iamfirda',
            name: 'firda',
            password: 'swiftie13'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()

        assert.strictEqual(userAtEnd.length, userAtStart.length+1)
        const usernames = userAtEnd.map(user=>user.username)
        assert(usernames.includes(newUser.username))
    })
    
})

describe('validation post request', ()=>{
    test('password cant be missing', async()=>{
        const newUser = {
            username: 'newuser',
            name:'firda',
        }

        const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('password is missing'))
    })
    test('if password less than 3 characters long return bad request', async()=>{
        const newUser = {
            username: 'user2',
            name: 'firda',
            password: 'ty'
        }

        const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('password must have at least 3 characters long'))
    })

    test('if username has less than 3 characters long return bad request', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'ly',
            name: 'lessthan3',
            password: 'cancelpost'
        }

        const result = await api
                            .post('/api/users')
                            .send(newUser)
                            .expect(400)
                            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        assert(result.body.error.includes('User validation failed'))
    })

    test('error if username is already in database', async () => {
        const newUser = {
            username: 'root',
            name: 'notunique',
            password:'iamswiftie'
        }

        const result = await api.post('/api/users/')
                                .send(newUser)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)
        
        assert(result.body.error.includes('expected `username` to be unique'))
    })
})
after( async () => {
    await mongoose.connection.close()
})