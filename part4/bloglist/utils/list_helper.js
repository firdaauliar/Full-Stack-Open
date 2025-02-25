const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const reducer = (sum, item) => {
        return sum+item
    }


    return blogs.length === 0 
        ? 0
        : likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    let maxLikes = likes[0]
    for(let i = 0; i<likes.length; i++){
        if(likes[i] > maxLikes){
            maxLikes = likes[i]
        }
    }

    const favBlog = blogs.filter(blog => blog.likes === maxLikes)[0]
    return favBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}