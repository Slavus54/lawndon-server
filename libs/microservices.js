const mongoose = require('mongoose')
const body_parser = require('body-parser')
const shortid = require('shortid')
const {ApolloServer} = require('apollo-server-express')
const Centum = require('centum.js')
const questions = require('./questions.json')

const common_middleware = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    
    next()
}

const middleware = (app, limit = '10mb') => {
    app.use(common_middleware)
    app.use(body_parser.urlencoded({extended: true}))
    app.use(body_parser.json({limit}))
}

const mongo_connect = async (url, label = 'MongoDB connected') => {
    await mongoose.connect(url).then(() => console.log(label))
}

const apollo_start = async (typeDefs, resolvers, app) => {
    let server = new ApolloServer({typeDefs, resolvers})

    await server.start()
    await server.applyMiddleware({app})
}

const slicer = (arr, length, type = 'new') => {
    let diff = type === 'new' ? arr.length - length : 0

    return arr.slice(diff, type === 'new' ? arr.length : length) || []
}

const get_id = (length = 9) => {
    let result = shortid.generate().toString()

    return result.slice(0, length)
}

const get_question = () => {
    let result = new Centum().random(questions)?.value

    return result
}

module.exports = {
    middleware,
    mongo_connect,
    apollo_start,
    slicer,
    get_id,
    get_question
}