
const payloadJSON = document.getElementById('jsonData').textContent

const messagesDiv = document.getElementById('messagesDiv')

const payload = JSON.parse(payloadJSON)

console.log(payload)

const { messages } = payload

const userEmiter = messages.from
const userReceptor = messages.to

const { chatId } = messages


const socket = io()

const chatBox = document.getElementById('chatBox')
const sendMessage = document.getElementById('sendMessage')

chatBox.addEventListener('keyup', (e)=>{
	if (e.key==='Enter') {
		console.log(chatBox.value)
			const date = new Date().getDate()

			const messageDiv = document.createElement('div')
			const userMessage = document.createElement('h4')
			userMessage.textContent = userEmiter.first_name
			const textMessage = document.createElement('p')
			textMessage.textContent = chatBox.value
			messageDiv.appendChild(userMessage)
			messageDiv.appendChild(textMessage)

			messagesDiv.appendChild(messageDiv)
			

			const message = userEmiter.userId+'%&@'+date+'%&@'+chatBox.value
			const send = message+'%&@'+ chatId
			socket.emit('message', {send})
			chatBox.value=""
	}
})

sendMessage.addEventListener('click', (e)=>{

			const date = new Date().getTime()

			const messageDiv = document.createElement('div')
			const userMessage = document.createElement('h4')
			userMessage.textContent = userEmiter.first_name
			const textMessage = document.createElement('p')
			textMessage.textContent = chatBox.value
			messageDiv.appendChild(userMessage)
			messageDiv.appendChild(textMessage)

			messagesDiv.appendChild(messageDiv)
			

			const message = userEmiter.userId+'%&@'+date+'%&@'+chatBox.value
			const send = message+'%&@'+ chatId
			socket.emit('message', {send})
			chatBox.value=""
	
})

socket.on('messageLogs', data=>{
    console.log(data)
	let log = document.getElementById('messageLogs')
	let messages = ''
	data.forEach(message => {
		messages = messages+`dice ${message.message}`
	})
})