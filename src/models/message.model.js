const mongoose = require('mongoose')



const messageCollection = 'message'


const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: 'admin',
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    messages: {
        type: [
                {
                user: String,
                text: String,                                 
                date: {
                    type: Date
                }
            }
        ]
    },
})

const Messages = mongoose.model(messageCollection, messageSchema)


module.exports = Messages