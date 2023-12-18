const {Schema, model} = require('mongoose') 

const Mowings = new Schema({
    shortid: String,
    account_id: String,
    username: String,
    title: String,
    category: String,
    level: String,
    square: Number,
    date: String,
    time: String,
    region: String,
    cords: {
        lat: Number,
        long: Number
    },
    borders: [{
        lat: Number,
        long: Number
    }],
    main_photo: String,
    members: [{
        telegram_tag: String,
        username: String,
        activity: String
    }],
    topics: [{
        shortid: String,
        name: String,
        text: String,
        category: String,
        supports: Number
    }]
})  

module.exports = model('Mowings', Mowings)