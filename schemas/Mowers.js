const {Schema, model} = require('mongoose') 

const Mowers = new Schema({
    shortid: String,
    account_id: String,
    username: String,
    title: String,
    category: String,
    format: String,
    country: String,
    cut_size: Number,
    isStripe: Boolean,
    link: String,
    main_photo: String,
    reviews: [{
        shortid: String,
        name: String,
        content: String,
        test: String,
        rate: Number
    }],
    offers: [{
        shortid: String,
        name: String,
        marketplace: String,
        format: String,
        cost: Number,
        cords: {
            lat: Number,
            long: Number
        },
        likes: Number
    }]
})  

module.exports = model('Mowers', Mowers)