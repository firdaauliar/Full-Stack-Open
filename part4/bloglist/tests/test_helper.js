const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

const initialUser = [
    {
      username: 'initialuser',
      name: 'initial user',
      password: 'testhelperuser'
    }
  ]

const nonExistingId = async() => {
    const blog = new Blog({
        title: 'will soon be removed',
        author: 'author1',
        url: 'noneId.com',
    })

    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})

    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})

    return users.map(user=>user.toJSON())
}

const loginOneUser = async (username, password) => {

  const user = await User.findOne({username})
  const isPasswordTrue = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if(!(user && isPasswordTrue)){
    return response.status(401).json({
        error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  
  return {
    token, user
  }
}

const registerUser = async()=>{
  const user = {
    username: "root",
    password: "sekret"
  }


}
module.exports = {
    initialBlogs,
    initialUser,
    nonExistingId,
    blogsInDb,
    usersInDb,
    loginOneUser
}