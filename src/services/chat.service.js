const MessagesDao = require('../DAO/mongo/message-dao.mongo');

const messagesDao = new MessagesDao()


const startChat = async (userEmmiter, userReceptor, arrayReceptors) => {
try {
    console.log(userEmmiter, userReceptor)

    const messages = await messagesDao.startChatDao(userEmmiter, userReceptor)

    return messages
} catch (error) {
    throw error
}
}


const saveMessage = async (messageInput) => {
    try {

        const messageRaw = messageInput.send.split('%&@')

        const userId = messageRaw[0]
        const date = messageRaw[1]
        const message = messageRaw[2]
        const chatId = messageRaw[3]

        console.log(messageRaw)

        const messageReturn = await messagesDao.saveMessage(chatId, userId, message)

        

    } catch (error) {
        throw error
    }
}

const loadMessages = async (chatId) => {
try {
    const messagesRaw = await messagesDao.loadMessages(chatId)

    return messagesRaw
} catch (error) {
    throw error
}
}



module.exports = {
    startChat,
    loadMessages,
    saveMessage
}