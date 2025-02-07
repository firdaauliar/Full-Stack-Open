const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
const password = process.argv[2]

const mongourl = `mongodb+srv://fauliarahma05:${password}@cluster0.oiuzv.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)
mongoose.connect(mongourl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
        // .catch(error=>next(error))
})

app.post('/api/blogs', (request, response)=>{
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
        // .catch(error=>next(error))


})

const PORT = 3003

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})