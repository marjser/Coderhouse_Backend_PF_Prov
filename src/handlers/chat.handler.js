const { loadMessages } = require("../services/chat.service")

// NO TERMINADO

const chatReceptor = async (io) => {
    try {
        
    } catch (error) {
        
    }
}


socket.on('message', data=>{
    console.log(data)
    messages.push(data)
    console.log(messages)
    //io.emit('messageLogs', 'hola desde server')
    io.emit('messageLogs', messages)
})