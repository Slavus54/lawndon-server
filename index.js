require('dotenv').config()
const app = require('express')()
const {gql} = require('apollo-server-express')
const {Telegraf, Markup} = require('telegraf')

const questions = require('./libs/questions.json')

const PORT = process.env.PORT || 4000
const token = process.env.TELEGRAM_TOKEN

// schemas

const Profiles = require('./schemas/Profiles') 
const Mowers = require('./schemas/Mowers') 
const Mowings = require('./schemas/Mowings') 
const Forums = require('./schemas/Forums') 

// microservices

const {middleware, mongo_connect, apollo_start, slicer, get_id, get_question} = require('./libs/microservices')

// middlewares

middleware(app)
mongo_connect(process.env.MONGO_URL, 'MongoDB is connected...')

const typeDefs = gql`
    type Query {
        test: String!
    }
    type Cord {
        lat: Float!,
        long: Float!
    }
    input ICord {
        lat: Float!,
        long: Float!
    }
    type UserCookie {
        account_id: String!,
        username: String!
    }
    type AccountComponent {
        shortid: String!,
        title: String!,
        path: String!
    }
    type Order {
        shortid: String!,
        msg: String!,
        square: Float!,
        cost: Float!,
        date: String!,
        isAccepted: Boolean!
    }
    type Zone {
        shortid: String!,
        title: String!,
        category: String!,
        cords: Cord!,
        square: Float!,
        status: String!,
        photo_url: String!,
        likes: Float!
    }
    type Review {
        shortid: String!,
        name: String!,
        content: String!,
        test: String!,
        rate: Float!
    }
    type Offer {
        shortid: String!,
        name: String!,
        marketplace: String!,
        format: String!,
        cost: Float!,
        cords: Cord!,
        likes: Float!
    }
    type Member {
        telegram_tag: String!,
        username: String!,
        activity: String!
    }
    type Topic {
        shortid: String!,
        name: String!,
        text: String!,
        category: String!,
        supports: Float!
    }
    type Image {
        shortid: String!,
        text: String!,
        level: String!,
        format: String!,
        status: String!,
        photo_url: String!
    }
    type Source {
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        url: String!,
        likes: Float!
    }
    type Forum {
        id: ID!,
        shortid: String!,
        account_id: String!,
        username: String!,
        title: String!,
        category: String!,
        format: String!,
        country: String!,
        description: String!,
        status: String!,
        region: String!,
        cords: Cord!,
        telegram_tag: String!,
        progress: Float!,
        images: [Image]!,
        sources: [Source]!
    }
    type Mowing {
        id: ID!,
        shortid: String!,
        account_id: String!,
        username: String!,
        title: String!,
        category: String!,
        level: String!,
        square: Float!,
        date: String!,
        time: String!,
        region: String!,
        cords: Cord!,
        borders: [Cord]!,
        main_photo: String!,
        members: [Member]!,
        topics: [Topic]!
    }
    type Mower {
        id: ID!,
        shortid: String!,
        account_id: String!,
        username: String!,
        title: String!,
        category: String!,
        format: String!,
        country: String!,
        cut_size: Float!,
        isStripe: Boolean!,
        link: String!,
        main_photo: String!,
        reviews: [Review]!,
        offers: [Offer]!
    }
    type Profile {
        account_id: String!,
        username: String!,
        security_code: String!,
        telegram_tag: String!,
        region: String!,
        cords: Cord!,
        activity_day: String!,
        rate: Float!,
        budget: Float!,
        area_size: Float!,
        main_photo: String!,
        orders: [Order]!,
        zones: [Zone]!,
        account_components: [AccountComponent]!
    }
    type Mutation {
        register(username: String!, security_code: String!, telegram_tag: String!, region: String!, cords: ICord!, activity_day: String!, main_photo: String!) : UserCookie!
        login(security_code: String!) : UserCookie!
        getProfiles(username: String!) : [Profile]!
        getProfile(account_id: String!) : Profile
        updateProfilePersonalInfo(account_id: String!, username: String!, main_photo: String!) : String!
        updateProfileGeoInfo(account_id: String!, region: String!, cords: ICord!) : String!
        updateProfileLawncareInfo(account_id: String!, activity_day: String!, rate: Float!) : String!
        updateProfileSecurityCode(account_id: String!, security_code: String!) : String!
        manageProfileOrder(account_id: String!, option: String!, msg: String!, square: Float!, cost: Float!, date: String!, coll_id: String!) : String!
        manageProfileZone(account_id: String!, option: String!, title: String!, category: String!, cords: ICord!, square: Float!, status: String!, photo_url: String!, coll_id: String!) : String!
        createMower(username: String!, id: String!, title: String!, category: String!, format: String!, country: String!, cut_size: Float!, isStripe: Boolean!) : String!
        getMowers(username: String!) : [Mower]!
        getMower(username: String!, shortid: String!) : Mower!
        makeMowerReview(username: String!, id: String!, content: String!, test: String!, rate: Float!) : String!
        updateMowerInfo(username: String!, id: String!, link: String!, main_photo: String!) : String!
        manageMowerOffer(username: String!, id: String!, option: String!, marketplace: String!, format: String!, cost: Float!, cords: ICord!, coll_id: String!) : String!
        createMowing(username: String!, id: String!, title: String!, category: String!, level: String!, square: Float!, date: String!, time: String!, region: String!, cords: ICord!, borders: [ICord]!, activity: String!) : String!
        getMowings(username: String!) : [Mowing]!
        getMowing(username: String!, shortid: String!) : Mowing!
        manageMowingStatus(username: String!, id: String!, option: String!, activity: String!) : String!
        updateMowingPhoto(username: String!, id: String!, main_photo: String!) : String!
        manageMowingTopic(username: String!, id: String!, option: String!, text: String!, category: String!, coll_id: String!) : String!
        createForum(username: String!, id: String!, title: String!, category: String!, format: String!, country: String!, description: String!, status: String!, region: String!, cords: ICord!) : String!
        getForums(username: String!) : [Forum]!
        getForum(username: String!, shortid: String!) : Forum!
        manageForumImage(username: String!, id: String!, option: String!, text: String!, level: String!, format: String!, status: String!, photo_url: String!, coll_id: String!) : String!
        updateForumProgress(username: String!, id: String!, progress: Float!) : String!
        manageForumSource(username: String!, id: String!, option: String!, title: String!, category: String!, url: String!, coll_id: String!) : String!
    }
`

const resolvers = {
    Query: {
        test: () => 'Hi'
    },
    Mutation: {
        register: async (_, {username, security_code, telegram_tag, region, cords, activity_day, main_photo}) => {
            const profile = await Profiles.findOne({username}) 
            let drop_object = {account_id: '', username}

            if (profile === null) {

                let account_id = get_id()

                const newProfile = new Profiles({
                    account_id,
                    username,
                    security_code,
                    telegram_tag,
                    region,
                    cords,
                    activity_day,
                    rate: 1,
                    budget: 0,
                    area_size: 0,
                    main_photo,
                    orders: [],
                    zones: [],
                    account_components: []
                })

                drop_object = {account_id, username}
                
                await newProfile.save()
            } 
        
            return drop_object
        },
        login: async (_, {security_code}) => {
            const profile = await Profiles.findOne({security_code}) 
            let drop_object = {account_id: '', username: ''}
           
            if (profile) {  
                drop_object = {account_id: profile.account_id, username: profile.username}                       
            }

            return drop_object
        },
        getProfiles: async (_, {username}) => {
            const profiles = await Profiles.find() 

            return profiles
        },
        getProfile: async (_, {account_id}) => {
            const profile = await Profiles.findOne({account_id}) 
            
            return profile
        },
        updateProfilePersonalInfo: async (_, {account_id, username, main_photo}) => {
            const profile = await Profiles.findOne({account_id}) 
            const new_profile = await Profiles.findOne({username})

            if (profile) {
                
                if (!new_profile) {
                    profile.username = username
                }

                profile.main_photo = main_photo

                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        updateProfileGeoInfo: async (_, {account_id, region, cords}) => {
            const profile = await Profiles.findOne({account_id}) 

            if (profile) {

                profile.region = region
                profile.cords = cords
             
                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        updateProfileLawncareInfo: async (_, {account_id, activity_day, rate}) => {
            const profile = await Profiles.findOne({account_id}) 

            if (profile) {

                profile.activity_day = activity_day
                profile.rate = rate
                
                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        updateProfileSecurityCode: async (_, {account_id, security_code}) => {
            const profile = await Profiles.findOne({account_id}) 

            if (profile) {

                profile.security_code = security_code

                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        manageProfileOrder: async (_, {account_id, option, msg, square, cost, date, coll_id}) => {
            const profile = await Profiles.findOne({account_id}) 

            if (profile) {
                if (option === 'create') {

                    let shortid = get_id()

                    profile.orders = [...profile.orders, {
                        shortid,
                        msg,
                        square,
                        cost,
                        date,
                        isAccepted: false
                    }]

                } else if (option === 'accept') {

                    profile.orders.map(el => {
                        if (el.shortid === coll_id) {
                            el.isAccepted = true
                        }
                    })

                    profile.budget += cost

                } else {

                    profile.orders = profile.orders.filter(el => el.shortid !== coll_id)
                }

                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        manageProfileZone: async (_, {account_id, option, title, category, cords, square, status, photo_url, coll_id}) => {
            const profile = await Profiles.findOne({account_id}) 

            if (profile) {
                if (option === 'create') {

                    let shortid = get_id()

                    profile.zones = [...profile.zones, {
                        shortid,
                        title,
                        category,
                        cords,
                        square,
                        status,
                        photo_url,
                        likes: 0
                    }]

                    profile.zones = slicer(profile.zones, 20)

                    profile.area_size += square

                } else if (option === 'delete') {

                    profile.zones = profile.zones.filter(el => el.shortid !== coll_id)

                    profile.area_size -= square

                } else {

                    profile.zones.map(el => {
                        if (el.shortid === coll_id) {
                            if (option === 'update') {
                                el.status = status
                                el.photo_url = photo_url
                            } else if (option === 'like') {
                                el.likes += 1
                            }
                        }
                    })
                }

                await Profiles.updateOne({account_id}, {$set: profile})

                return 'Success'
            }

            return 'Error'
        },
        createMower: async (_, {username, id, title, category, format, country, cut_size, isStripe}) => {
            const profile = await Profiles.findOne({username, account_id: id}) 
            const mower = await Mowers.findOne({username, title, category, format, country, cut_size, isStripe})

            if (profile && !mower) {
                if (profile.account_components.filter(el => el.path === 'mower').find(el => el.title === title) === undefined) {

                    let shortid = get_id()

                    profile.account_components = [...profile.account_components, {
                        shortid,
                        title,
                        path: 'mower'
                    }]

                    const newMower = new Mowers({
                        shortid,
                        account_id: profile.account_id,
                        username: profile.username,
                        title,
                        category,
                        format,
                        country,
                        cut_size,
                        isStripe,
                        link: '',
                        main_photo: '',
                        reviews: [],
                        offers: []
                    })

                    await Profiles.updateOne({username, account_id: id}, {$set: profile})
                    await newMower.save()

                    return 'Success'
                }
            }

            return 'Error'
        },
        getMowers: async (_, {username}) => {
            const mower = await Mowers.find()

            return mower
        },
        getMower: async (_, {username, shortid}) => {
            const mower = await Mowers.findOne({shortid})

            return mower
        },
        makeMowerReview: async (_, {username, id, content, test, rate}) => {
            const profile = await Profiles.findOne({username})
            const mower = await Mowers.findOne({shortid: id})

            if (profile && mower) {
                
                let shortid = get_id()

                mower.reviews = [...mower.reviews, {
                    shortid,
                    name: profile.username,
                    content,
                    test,
                    rate
                }]

                mower.reviews = slicer(mower.reviews, 20)

                await Mowers.updateOne({shortid: id}, {$set: mower})

                return 'Success'
            }
        
            return 'Error'
        },
        updateMowerInfo: async (_, {username, id, link, main_photo}) => {
            const profile = await Profiles.findOne({username})
            const mower = await Mowers.findOne({shortid: id})

            if (profile && mower) {

                mower.link = link
                mower.main_photo = main_photo
                
                await Mowers.updateOne({shortid: id}, {$set: mower})

                return 'Success'
            }
        
            return 'Error'
        },
        manageMowerOffer: async (_, {username, id, option, marketplace, format, cost, cords, coll_id}) => {
            const profile = await Profiles.findOne({username})
            const mower = await Mowers.findOne({shortid: id})

            if (profile && mower) {
                if (option === 'create') {

                    let shortid = get_id()

                    mower.offers = [...mower.offers, {
                        shortid,
                        name: profile.username,
                        marketplace,
                        format,
                        cost,
                        cords,
                        likes: 0
                    }]

                    mower.offers = slicer(mower.offers, 20)

                } else if (option === 'like') {

                    mower.offers.map(el => {
                        if (el.shortid === coll_id) {
                            el.likes += 1
                        }
                    })

                } else {

                    mower.offers = mower.offers.filter(el => el.shortid !== coll_id)
                }
                
                await Mowers.updateOne({shortid: id}, {$set: mower})

                return 'Success'
            }
        
            return 'Error'
        },
        createMowing: async (_, {username, id, title, category, level, square, date, time, region, cords, borders, activity}) => {
            const profile = await Profiles.findOne({username, account_id: id})
            const mowing = await Mowings.findOne({username, title, category, level, square, date, time, region, cords, borders})

            if (profile && !mowing) {
                if (profile.account_components.filter(el => el.path === 'mowing').find(el => el.title === title) === undefined) {

                    let shortid = get_id()

                    profile.account_components = [...profile.account_components, {
                        shortid,
                        title,
                        path: 'mowing'
                    }]  

                    const newMowing = new Mowings({
                        shortid,
                        account_id: profile.account_id,
                        username: profile.username,
                        title,
                        category,
                        level,
                        square,
                        date,
                        time,
                        region,
                        cords,
                        borders,
                        main_photo: '',
                        members: [{
                            telegram_tag: profile.telegram_tag,
                            username: profile.username,
                            activity
                        }],
                        topics: []
                    })

                    await Profiles.updateOne({username, account_id: id}, {$set: profile})
                    await newMowing.save()

                    return 'Success'
                }
            }

            return 'Error'
        },
        getMowings: async (_, {username}) => {
            const mowing = await Mowings.find()

            return mowing
        },
        getMowing: async (_, {username, shortid}) => {
            const mowing = await Mowings.findOne({shortid})

            return mowing
        },
        manageMowingStatus: async (_, {username, id, option, activity}) => {
            const profile = await Profiles.findOne({username})
            const mowing = await Mowings.findOne({shortid: id})

            if (profile && mowing) {
                if (option === 'join') {

                    profile.account_components = [...profile.account_components, {
                        telegram_tag: profile.telegram_tag,
                        title: mowing.title,
                        path: 'mowing'
                    }]  

                    mowing.members = [...mowing.members, {
                        account_id: profile.account_id,
                        username: profile.username,
                        activity
                    }]

                } else if (option === 'update') {

                    mowing.members.map(el => {
                        if (el.telegram_tag === profile.telegram_tag) {
                            el.activity = activity
                        }
                    })

                } else {

                    profile.account_components = profile.account_components.filter(el => el.shortid !== mowing.shortid)

                    mowing.members = mowing.members.filter(el => el.telegram_tag !== profile.telegram_tag)
                }

                await Profiles.updateOne({username}, {$set: profile})
                await Mowings.updateOne({shortid: id}, {$set: mowing})

                return 'Success'
            }

            return 'Error'
        },
        updateMowingPhoto: async (_, {username, id, main_photo}) => {
            const profile = await Profiles.findOne({username})
            const mowing = await Mowings.findOne({shortid: id})

            if (profile && mowing) {

                mowing.main_photo = main_photo

                await Mowings.updateOne({shortid: id}, {$set: mowing})

                return 'Success'
            }

            return 'Error'
        },
        manageMowingTopic: async (_, {username, id, option, text, category, coll_id}) => {
            const profile = await Profiles.findOne({username})
            const mowing = await Mowings.findOne({shortid: id})

            if (profile && mowing) {
                if (option === 'create') {

                    let shortid = get_id()

                    mowing.topics = [...mowing.sources, {
                        shortid,
                        name: profile.username,
                        text,
                        category,
                        supports: 0
                    }]

                    mowing.topics = slicer(mowing.topics, 20)

                } else if (option === 'support') {

                    mowing.topics.map(el => {
                        if (el.shortid === coll_id) {
                            el.supports += 1
                        }
                    })

                } else {

                    mowing.topics = mowing.topics.filter(el => el.shortid !== coll_id)
                }
                
                await Mowings.updateOne({shortid: id}, {$set: mowing})

                return 'Success'
            }

            return 'Error'
        },
        createForum: async (_, {username, id, title, category, format, country, description, status, region, cords}) => {
            const profile = await Profiles.findOne({username, account_id: id})
            const forum = await Forums.findOne({username, title, category, format, country, description, status, region, cords})
        
            if (profile && !forum) {
                if (profile.account_components.filter(el => el.path === 'forum').find(el => el.title === title) === undefined) {

                    let shortid = get_id()

                    profile.account_components = [...profile.account_components, {
                        shortid,
                        title,
                        path: 'forum'
                    }]

                    const newForum = new Forums({
                        shortid,
                        account_id: profile.username,
                        username: profile.username,
                        title,
                        category,
                        format,
                        country,
                        description,
                        status,
                        region,
                        cords,
                        telegram_tag: profile.telegram_tag,
                        progress: 0,
                        images: [],
                        sources: []
                    })

                    await Profiles.updateOne({username, account_id: id}, {$set: profile})
                    await newForum.save()

                    return 'Success'
                }
            }

            return 'Error'
        },
        getForums: async (_, {username}) => {
            const forums = await Forums.find()
            
            return forums
        },
        getForum: async (_, {username, shortid}) => {
            const forum = await Forums.findOne({shortid})
            
            return forum
        },
        manageForumImage: async (_, {username, id, option, text, level, format, status, photo_url, coll_id}) => {
            const profile = await Profiles.findOne({username})
            const forum = await Forums.findOne({shortid: id})

            if (profile && forum) {
                if (option === 'create') {
                    
                    let shortid = get_id()

                    forum.images = [...forum.images, {
                        shortid,
                        text,
                        level,
                        format,
                        status,
                        photo_url
                    }]

                    forum.images = slicer(forum.images, 20)

                } else if (option === 'update') {

                    forum.images.map(el => {
                        if (el.shortid === coll_id) {
                            el.status = status
                        }
                    })

                } else {

                    forum.images = forum.images.filter(el => el.shortid !== coll_id)
                }

                await Forums.updateOne({shortid: id}, {$set: forum})

                return 'Success'
            }

            return 'Error'
        },
        updateForumProgress: async (_, {username, id, progress}) => {
            const profile = await Profiles.findOne({username})
            const forum = await Forums.findOne({shortid: id})

            if (profile && forum) {

                forum.progress = progress
              
                await Forums.updateOne({shortid: id}, {$set: forum})

                return 'Success'
            }

            return 'Error'
        },
        manageForumSource: async (_, {username, id, option, title, category, url, coll_id}) => {
            const profile = await Profiles.findOne({username})
            const forum = await Forums.findOne({shortid: id})

            if (profile && forum) {
                if (option === 'create') {
                    
                    let shortid = get_id()

                    forum.sources = [...forum.sources, {
                        shortid,
                        name: profile.username,
                        title,
                        category,
                        url,
                        likes: 0
                    }]

                    forum.sources = slicer(forum.sources, 20)

                } else if (option === 'like') {

                    forum.sources.map(el => {
                        if (el.shortid === coll_id) {
                            el.likes += 1
                        }
                    })
                    
                } else {

                    forum.sources = forum.sources.filter(el => el.shortid !== coll_id)
                }

                await Forums.updateOne({shortid: id}, {$set: forum})

                return 'Success'
            }

            return 'Error'
        }




    }
}

apollo_start(typeDefs, resolvers, app)

const bot = new Telegraf(token)
let answer = ''

bot.launch()

bot.command('start', ctx => {
    ctx.reply(
        'Welcome to Lawndon Bot',
        Markup.keyboard([
            Markup.button.webApp('Platform', 'https://www.youtube.com')
        ])
    )
})

bot.command('help', ctx => {
    ctx.reply(`
    Use /question to generate new question
    Command /answer to see right answer
    Use /info to get data about platform 
    `)
})

bot.command('question', ctx => {
    let question = get_question()

    answer = question.answer

    ctx.reply('Ok, try to answer on it by yourself')
    ctx.sendMessage(question.title)
})

bot.command('answer', ctx => {
    ctx.reply(`Answer - ${answer}`)
})

bot.command('info', ctx => {
    ctx.reply('Lawndon.IO - Transforming lawncare, rooted in excellence.')
})

app.get('/questions', async (req, res) => {
    res.send(questions)   
})

app.listen(PORT, () => console.log(`Server started on ${PORT} port`))