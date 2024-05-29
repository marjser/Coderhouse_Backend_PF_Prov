
const jsonData = document.getElementById('jsonData').textContent
const divFormId = document.getElementById('divFormId')
const divFormAddress = document.getElementById('divFormAddress')
const divFormAccount = document.getElementById('divFormAccount')
const premiumButton = document.getElementById('premiumButton')

const title = document.getElementById('title')

const {user} = JSON.parse(jsonData)

console.log(user)

const {documents: userDocs} = user

const idDoc = userDocs.findIndex(doc => doc.name === 'userIdentification')
const adressDoc = userDocs.findIndex(doc => doc.name === 'userAddress')
const accountDoc = userDocs.findIndex(doc => doc.name === 'userAccount')



title.textContent = `Tu solicitud para pasar a premium comienza ${user.first_name}`


const form = document.getElementById('form')
const formSubmit = document.getElementById('submitButton')
const formId = document.getElementById('formId')
const formAddress = document.getElementById('formAddress')
const formAccount = document.getElementById('formAccount')



formId.addEventListener('submit', async (e) => {

    console.log('boton submit')

    const data = {
        document: 'userIdentification'
    }
    
    const response = await fetch(`/users/${user.id}/documents`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message)
        location.reload()
      })
      .catch(error => console.error(error));


        
    e.preventDefault()
})

formAddress.addEventListener('submit', async (e) => {
    
    console.log('boton submit')
    
    const data = {
        document: 'userIdentification'
    }
    
    const response = await fetch(`/users/${user.id}/documents`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message)
      })
      .catch(error => console.error(error));


      location.reload()
        
    e.preventDefault()
})

formAccount.addEventListener('submit', async (e) => {

    console.log('boton submit')

    const data = {
        document: 'userIdentification'
    }
    
    const response = await fetch(`/users/${user.id}/documents`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message)
        window.location.href = `/profile/${user.email}`
      })
      .catch(error => console.error(error));


      location.reload()
        
    e.preventDefault()
})

if (idDoc != -1) {
    divFormId.innerHTML = '<p>Comprobante de identificación ya subido</p>'
}
if (adressDoc != -1) {
    divFormAddress.innerHTML = '<p>Comprobante de domicilio ya subido</p>'
}
if (accountDoc != -1) {
    divFormAccount.innerHTML = '<p>Comprobante de cuenta ya subido</p>'
}

premiumButton.addEventListener('click', async (e)=>{

    if (idDoc == -1 || adressDoc == -1 || accountDoc == -1) {
        return alert('Faltan subir documentos')
    }


    const response = await fetch(`/users/premium/${user.id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message)
      })
      .catch(error => console.error(error));
})