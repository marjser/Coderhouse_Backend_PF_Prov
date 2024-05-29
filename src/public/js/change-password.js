

const userId = '664baedf96662a7771be61bd'

const newPasswordForm = document.getElementById('newPasswordForm')

newPasswordForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    const data = new FormData(newPasswordForm)

    const obj = {}
    
    data.forEach((value, key) => obj[key] = value)
    
    if (obj.newPassword !== obj.newPasswordRepeat) {
        return alert('Las contraseñas no coinciden')
    }

    const {newPassword} = obj




    const sendData = JSON.stringify({
        userId,
        newPassword
    })

    fetch('/auth/change-password-prov', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}`
        },
        body: sendData
    })
    .then(response => response.json())  
    .then(data => {
        console.log(data)
        if (data.status === 'success') {
            window.location.href = '/login'
        }
    })
    .catch(error => console.error('Error:', error))

})

