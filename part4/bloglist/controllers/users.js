const userRouter = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const Blog = require('../models/blog')
const blog = require('../models/blog')


userRouter.get('/', async (request, response, next)=>{
    
        const users = await User.find({}).populate('blogs', {url:1, author: 1, title: 1, likes: 1})
        // const users = await User
                        // .find({}).populate('blogs')
        response.json(users)

})

userRouter.post('/', async (request, response) => {
        const { username, name, password } = request.body
        const saltRounds = 10
        

        if (!password){
                return response.status(400).json({
                        error:'password is missing'
                })
        }else if(password.length<3){
                return response.status(400).json({
                        error:'password must have at least 3 characters long'
                })
        }else{
                const passwordHash = await bcrypt.hash(password, saltRounds)
                const user = new User({
                        username, name, passwordHash
                })

                const savedUser = await user.save()
                response.status(201).json(savedUser)
        }


})

userRouter.get('/:id', async (request, response) => {
        const result = await User.findById(request.params.id)
                                .populate('blogs')
                                .exec((err, user)=>{
                                        const initialLength = user.blogs.length
                                        let isUpdated = user.blogs.length
                                        user.blogs = user.blogs.filter(blog => blog !== null)
                                        isUpdated = initialLength > user.blogs.length
                                        if(isUpdated){
                                                user.save()
                                        }
                                })

        if(result){
                response.json(result)
        }else{
                response.status(404).end()
        }
})

userRouter.delete('/:id', async (request, response)=>{
        const user = await User.findById(request.params.id)
        const result = await User.findByIdAndDelete(request.params.id)
        console.log(user.blogs.length)
        if(user.blogs.length > 0){
                const blogs = user.blogs.map(blog => Blog.findById(blog))
                await Promise.all(blogs)
                blogs.map(blog => delete blog.user)
                blogs.map(blog =>{ if(blog.user === null){delete blog.user}})
        }
        response.status(204).end()
})
module.exports = userRouter