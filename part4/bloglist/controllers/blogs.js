const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response, next) => {
    // console.log(blogs)
    try{
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
        response.json(blogs)
    }catch(exception){
        next(exception)
    }
        // .catch(error=>next(error))
})

blogRouter.get('/:id', async (request, response, next)=>{
    
    try{
        const blog = await Blog.findById(request.params.id)
        if(blog){
            response.json(blog)
        }else{
            response.status(404).end()
        }
    }
    catch(exception){
        next(exception)
    }

})

blogRouter.post('/', async (request, response, next)=>{
    const body = request.body    

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error: 'token invalid'})
    }
    try{
        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result)
    }catch(exception){
        next(exception)
    }
        // .catch(error=>next(error))

})

blogRouter.delete('/:id', async (request, response, next) => {
    
    try{
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if(!decodedToken.id){
            return response.status(401).json({error: 'token invalid'})
        }
        const blog = await Blog.findById(request.params.id)
        if(blog.user){
            if(blog.user.toString() === decodedToken.id.toString()){
                const result = await Blog.findByIdAndDelete(request.params.id)
                const user = await User.findById(blog.user)
                user.blogs.pull(request.params.id)
                await user.save()
            }
        }
        response.status(204).end()
    }catch(exception){
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response, next)=>{
    const body = request.body

    let blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    let user = ''

    try{
        if(body.userId){
            user = await User.findById(body.userId)
            blog = {
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes,
                user: user.id
            }
        }
        // console.log(body)
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        if(user){
            user.blogs = user.blogs.concat(request.params.id)
            await user.save()
        }
        response.json(updatedBlog)
    }catch(exception){
        next(exception)
    }
})

module.exports = blogRouter