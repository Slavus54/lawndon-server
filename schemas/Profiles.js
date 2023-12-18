const {Schema, model} = require('mongoose') 

const Profiles = new Schema({
    account_id: String,
    username: String,
    security_code: String,
    telegram_tag: String,
    region: String,
    cords: {
        lat: Number,
        long: Number
    },
    activity_day: String,
    rate: Number,
    budget: Number,
    area_size: Number,
    main_photo: String,
    orders: [{
        shortid: String,
        msg: String,
        square: Number,
        cost: Number,
        date: String,
        isAccepted: Boolean
    }],
    zones: [{
        shortid: String,
        title: String,
        category: String,
        cords: {
            lat: Number,
            long: Number
        },
        square: Number,
        status: String,
        photo_url: String,
        likes: Number
    }],
    account_components: [{
        shortid: String,
        title: String,
        path: String
    }]
})

module.exports = model('Profiles', Profiles)