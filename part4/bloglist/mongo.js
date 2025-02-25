const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fauliarahma05:${password}@cluster0.oiuzv.mongodb.net/test_bloglist?retryWrites=true&w=majority&appName=Cluster0`

// const url = `mongodb+srv://fauliarahma05:${password}@cluster0.oiuzv.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
})
    
    const userSchema = new mongoose.Schema({
      username: String,
      name: String,
      passwordHash: String,
      blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
      ]
  })
  
  
  const Blog = mongoose.model('Blog', blogSchema)
  const User = mongoose.model('User', userSchema)

  
//   const blog = new Blog({
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//   })
//   const blog = new Blog({
//         _id: "5a422a851b54a676234d17f7",
//         title: "React patterns",
//         author: "Michael Chan",
//         url: "https://reactpatterns.com/",
//         likes: 7,
//         __v: 0
//   })

//   blog.save().then(result => {
//     console.log('blog saved!')
//     mongoose.connection.close()
//   })
  

  Blog
        .find({})
        .then(blogs => {
            blogs.forEach(blog => {
                console.log(blog)
            })
    mongoose.connection.close()
  })
})