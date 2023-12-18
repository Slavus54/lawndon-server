const {Schema, model} = require('mongoose') 

const Forums = new Schema({
    shortid: String,
    account_id: String,
    username: String,
    title: String,
    category: String,
    format: String,
    country: String,
    description: String,
    status: String,
    region: String,
    cords: {
        lat: Number,
        long: Number
    },
    telegram_tag: String,
    progress: Number,
    images: [{  
        shortid: String,
        text: String,
        level: String,
        format: String,
        status: String,
        photo_url: String
    }],
    sources: [{
        shortid: String,
        name: String,
        title: String,
        category: String,
        url: String,
        likes: Number
    }]
})  

module.exports = model('Forums', Forums)