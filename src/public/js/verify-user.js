
const boton = document.getElementById('boton')


const token = localStorage.getItem('token')


boton.addEventListener('click', (e)=> {
    console.log(token)

    fetch(`/auth/verify-password/${token}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error))

})

const userConfirmed = () => {


}

userConfirmed()

