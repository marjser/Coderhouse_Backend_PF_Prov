
const emailDataGenerator = (userEmail, responseMail) => {
    const emailData = {
        from: responseMail.from,
        to: userEmail.email,
        subject: responseMail.subject,
        html: responseMail.html,
        attachments: [

    ]
    }
    
    return emailData
}



module.exports = emailDataGenerator