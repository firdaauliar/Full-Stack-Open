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
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  }
]

beforeEach(async ()=>{
    await Blog.deleteMany({})

    const blogsObj = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogsObj.map(blog => blog.save())
    await Promise.all(promiseArray)
})



test.only('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test.only('there are two blogs', async()=>{
    const response = await api.get('/api/blogs')
    
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('the first blog title is about react', async ()=>{
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog=>blog.title)

    assert(titles.includes('React patterns'))
})

test('a new blog is added to database', async ()=>{
  const newBlog = {
    title: "this is a test to add new blog using async await",
    author: "Fauliarahma",
    url: "thisisurl.com",
    likes:10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, initialBlogs.length+1)
  assert(titles.includes('this is a test to add new blog using async await'))

})

test('the unique id in json response is named id', async ()=>{
  const dbResponse = await Blog.find({})
  const jsonResponse = await api.get('/api/blogs/')
  const jsonBody = jsonResponse.body.map(b=>b)
  const idxToFind = dbResponse.map(blog => blog._id.toString())

  const idKey = Object.keys(jsonBody[0]).find(key=>jsonBody[0][key] === idxToFind[0])
  
  assert.deepEqual(idKey, 'id')
})

test('if likes is not defined equal zero', async () => {
  const newBlog = {
    title: "test likes default",
    author: "Fauliarahma",
    url: "thisisurl.com",
    
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blog = response.body.map(blog => blog)
  
  // console.log(blog[blog.length-1])
  assert.strictEqual(blog[blog.length-1].likes, 0)
})

test('if url or and title is not defined then 400 bad request', async ()=>{
  const newBlog = {
    author: "Fauliarahma",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('a specific blogs can be retrieved', async ()=>{
  const blogsAtStart = await api.get('/api/blogs/')

  const blogToGet = blogsAtStart.body[1]

  const result = await api
    .get(`/api/blogs/${blogToGet.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(result.body, blogToGet)
})

test('to delete a blog post', async ()=>{
  const response = await api.get('/api/blogs')
  const idDelete =response.body[0].id 

  await api
    .delete(`/api/blogs/${idDelete}`)
    .expect(204)

  const updatedBlogs = await api.get('/api/blogs')
  const idUpdatedBlogs = updatedBlogs.body.map(blog=>blog.id)
  assert(!idUpdatedBlogs.includes(idDelete))
  
  assert.strictEqual(idUpdatedBlogs.length, initialBlogs.length-1)
})

test('to update the likes in the blog post', async()=>{
  const response = await api.get('/api/blogs')
  const idUpdate = response.body[0].id

  const updatedBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 10,
  }

  const updatedRes = await api.put(`/api/blogs/${idUpdate}`).send(updatedBlog)
  // console.log(updatedRes.body)
  assert.strictEqual(updatedRes.body.likes, 10)

})

describe('join user and blogs', () => {
  beforeEach(async()=>{
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username:'root', passwordHash})

    await user.save()
  })
  test('post blog with user id', async ()=>{
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
                          .send(newBlog)
                          .expect(201)
                          .expect('Content-Type', /application\/json/)
  })
})

after(async ()=>{
    await mongoose.connection.close()
})