const Messages = require("../../models/message.model");

class MessagesDao {
    
    async startChatDao (userEmmiter, userReceptor, arrayReceptors) {
        try {

            const messageData = {
                from: userEmmiter,
                to: userReceptor
            }

            const { from, to, _id} = await Messages.create(messageData)

            const messages = {
                from: from.toString(),
                to: to.toString(),
                chatId: _id.toString()
            }
            
            return messages
        } catch (error) {
            throw error
        }
    }

    async loadMessages (chatId) {
        try {
            const messagesRaw = await Messages.findById(chatId)
                .populate('from')
                .populate('to')

            const {_id, from, to, messages: messagesDocs} = messagesRaw

            const messages = []

            
            
            const chatReturn = {
                chatId: _id.toString(),
                from: {
                    userId: from._id.toString(),
                    first_name: from.first_name,
                    last_name: from.last_name
                },
                to: {
                    userId: to._id.toString(),
                    first_name: to.first_name,
                    last_name: to.last_name
                },
                messages: messages
            }
            
            if (messagesDocs.length == 0) {
                chatReturn.messages = []
            } else {
                messagesDocs.forEach(message => {
                    const {user, text, date} = message

                    messages.push({
                        user,
                        text,
                    })

                })

            }
            
            return chatReturn
        } catch (error) {
            throw error
        }
    }

    async saveMessage (chatId, userId, message) {
        try {

            const chatHistory = await Messages.findById(chatId)


            chatHistory.messages.push({
                user: userId,
                text: message ,
                date: Date.now()              
            })

            const {acknowledged} = await Messages.updateOne({_id: chatId}, chatHistory)

            if (!acknowledged) {
                return console.log('AGREGAR ERROR: error guardando mensaje')
            }

        } catch (error) {
            throw error
        }
    }


}

module.exports = MessagesDao