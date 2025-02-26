const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)
const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  }
]

const users = [{
  username: "root",
  password: "sekret"
}]
beforeEach(async ()=>{
    await Blog.deleteMany({})
    await User.deleteMany({})

  
    for(let user of users ){
      let passwordHash = await bcrypt.hash(user.password, 10)
      let userObj = new User({username: user.username, passwordHash})
      await userObj.save()
      let login = await helper.loginOneUser(user.username, user.password)
      let userId = login.user._id
      for(let blog of initialBlogs){
        blog.user = userId
        let blogObj = new Blog(blog)
        blogObj.save()
      }

    }
    // const blogsObj = initialBlogs.map(blog => new Blog(blog))
    // const promiseArray = blogsObj.map(blog => blog.save())
    // await Promise.all(promiseArray)
})



test.only('blogs are returned as json', async () => {
  const login = await helper.loginOneUser(users[0].username, users[0].password)
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${login.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test.only('there are three blogs', async()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)
    
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('the first blog title is about react', async ()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)

    const titles = response.body.map(blog=>blog.title)

    assert(titles.includes('React patterns'))
})

test('a new blog is added to database', async ()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  const newBlog = {
    title: "this is a test to add new blog using async await",
    author: "Fauliarahma",
    url: "thisisurl.com",
    likes:10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)

  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, initialBlogs.length+1)
  assert(titles.includes('this is a test to add new blog using async await'))

})

test('the unique id in json response is named id', async ()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)
  const dbResponse = await Blog.find({})

  const jsonResponse = await api.get('/api/blogs/').set('Authorization', `Bearer ${login.token}`)
  const jsonBody = jsonResponse.body.map(b=>b)
  const idxToFind = dbResponse.map(blog => blog._id.toString())

  const idKey = Object.keys(jsonBody[0]).find(key=>jsonBody[0][key] === idxToFind[0])
  
  assert.deepEqual(idKey, 'id')
})

test('if likes is not defined equal zero', async () => {
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  const newBlog = {
    title: "test likes default",
    author: "Fauliarahma",
    url: "thisisurl.com",
    
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)
  const blog = response.body.map(blog => blog)
  
  // console.log(blog[blog.length-1])
  assert.strictEqual(blog[blog.length-1].likes, 0)
})

test('if url or and title is not defined then 400 bad request', async ()=>{
  const newBlog = {
    author: "Fauliarahma",
  }
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${login.token}`)
    .send(newBlog)
    .expect(400)

})

test('a specific blogs can be retrieved', async ()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  const blogsAtStart = await api.get('/api/blogs/').set('Authorization', `Bearer ${login.token}`)

  const blogToGet = blogsAtStart.body[1]

  const result = await api
    .get(`/api/blogs/${blogToGet.id}`)
    .set('Authorization', `Bearer ${login.token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.deepStrictEqual(result.body, blogToGet)
})

test('to delete a blog post', async ()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)
  const idDelete =response.body[0].id 

  await api
    .delete(`/api/blogs/${idDelete}`)
    .set('Authorization', `Bearer ${login.token}`)
    .expect(204)

  const updatedBlogs = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)
  const idUpdatedBlogs = updatedBlogs.body.map(blog=>blog.id)
  assert(!idUpdatedBlogs.includes(idDelete))
  
  assert.strictEqual(idUpdatedBlogs.length, initialBlogs.length-1)
})

test('to update the likes in the blog post', async()=>{
  const login = await helper.loginOneUser(users[0].username, users[0].password)

  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${login.token}`)
  const idUpdate = response.body[0].id

  const updatedBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 10,
  }

  const updatedRes = await api
                            .put(`/api/blogs/${idUpdate}`)
                            .send(updatedBlog)
                            .set('Authorization', `Bearer ${login.token}`)
  // console.log(updatedRes.body)
  assert.strictEqual(updatedRes.body.likes, 10)

})

describe('join user and blogs', () => {
  // beforeEach(async()=>{
  //   await User.deleteMany({})

  //   const passwordHash = await bcrypt.hash('sekret', 10)
  //   const user = new User({username:'root', passwordHash})

  //   await user.save()
  // })
  test('post blog with user id', async ()=>{
    const login = await helper.loginOneUser(users[0].username, users[0].password)

    const userAtStart = await helper.usersInDb()
    const userId = userAtStart[0].id

    const newBlog = {
      title: 'test to join user',
      author: 'michael jackson',
      url: 'join.com',
      likes:9,
      userId: userId
    }

    const result = await api
                          .post('/api/blogs')
                          .set('Authorization', `Bearer ${login.token}`)
                          .send(newBlog)
                          .expect(201)
                          .expect('Content-Type', /application\/json/)
  })
})

after(async ()=>{
    await mongoose.connection.close()
})