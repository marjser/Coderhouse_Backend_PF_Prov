const jsonData = document.getElementById("jsonData")
const body = document.body

const {payload} = JSON.parse(jsonData.textContent)

const users = payload


const deleteUsers = document.getElementById('deleteUsers')

deleteUsers.addEventListener('click', (e)=>{
  e.preventDefault()

    fetch('/users/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const {payload} = data
      const userStrings = payload
      alert('usersIds deleted: ',data.payload)
      location.reload()
    })
    .catch(error => console.error(error))
})



const usersDiv = document.createElement('div')


let userCounter = 1

users.forEach(user => {
    const userDiv = document.createElement('div')

    const {id, age, first_name, last_name, email, role, sales, carts, last_connection, address, phoneNumber, userName  } = user

    const userCount = document.createElement('h5')
    const userId = document.createElement('h3')
    const userFirst_name = document.createElement('p')
    const userLast_name = document.createElement('p')
    const userUserName = document.createElement('p')
    const userEmail = document.createElement('p')
    const userAge = document.createElement('p')
    const userAddress = document.createElement('p')
    const userPhoneNumber = document.createElement('p')
    const userRole = document.createElement('p')
    const userSales = document.createElement('p')
    const userCarts = document.createElement('p')
    const userDocs = document.createElement('p')
    const userLast_connection = document.createElement('p')

    userCount.textContent = userCounter
    userId.textContent = `user: ${id}`
    userFirst_name.textContent = `First_Name: ${first_name}`
    userLast_name.textContent = `Last_Name: ${last_name}` 
    userUserName.textContent = `UserName: ${userName}`
    userAge.textContent = `Age: ${age}`
    userAddress.textContent = `Adress: ${address}`
    userPhoneNumber.textContent = `PhoneNumber: ${phoneNumber}`
    userEmail.textContent = `Email: ${email}`
    userRole.textContent = `Role: ${role}`
    userSales.textContent = 'Sales'
    userCarts.textContent = 'Carts'
    userDocs.textContent = 'userDocs FALTA'
    userLast_connection.textContent = `Last Connection: ${last_connection}`

    const form = document.createElement('form')
    const formLabel = document.createElement('label')

    formLabel.textContent = 'Change role: '
    formLabel.for = 'roleChange'
    
    const formSelect = document.createElement('select')
    formSelect.id = 'roleChange';
    formSelect.name = 'roleChange';

    form.appendChild(formLabel)
    form.appendChild(formSelect)

    const clientOpt = document.createElement('option')
    const premiumOpt = document.createElement('option')

    clientOpt.textContent = 'cliente'
    clientOpt.setAttribute('value', 'cliente')
    premiumOpt.textContent = 'premium'
    premiumOpt.setAttribute('value', 'premium')

 

    const options = ['client', 'premium'];

    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.innerText = optionText;
        formSelect.appendChild(option);
    });

    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('value', 'Confirm Role Change')

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()

        const userData = {
          userId: id,
          newRole: formSelect.value
        }

        if (role == formSelect.value) {
            return alert('Error with selected role')
        }
    

        console.log(userData)
    
        fetch(`/users/role/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
          const message = data.message
          console.log(message)
          alert(message);
          location.reload()
        })
        .catch(error => {
          console.error('Error making PUT request:', error);
        });
      })
      form.appendChild(submitButton)


    userDiv.appendChild(userCount)
    userDiv.appendChild(userId)
    userDiv.appendChild(userFirst_name)
    userDiv.appendChild(userLast_name)
    userDiv.appendChild(userUserName)
    userDiv.appendChild(userAge)
    userDiv.appendChild(userAddress)
    userDiv.appendChild(userPhoneNumber)
    userDiv.appendChild(userEmail)
    userDiv.appendChild(userRole)
    userDiv.appendChild(form)
    userDiv.appendChild(userSales)
    userDiv.appendChild(userCarts)
    userDiv.appendChild(userDocs)
    userDiv.appendChild(userLast_connection)

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete User'

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault()

        fetch(`/users/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
              console.log(data.message)
              alert(data.message)

            })
          .catch(error => console.error(error));

          location.reload()

    })

    userDiv.appendChild(deleteButton)


    usersDiv.appendChild(userDiv)


    userCounter++
})




body.appendChild(usersDiv)

function addFormWithSelect() {
    const form = document.createElement('form');

    const label = document.createElement('label');
    label.for = 'productType';
    label.innerText = 'Choose a product type: ';

    const select = document.createElement('select');
    select.id = 'productType';
    select.name = 'productType';

    const options = ['electronic', 'clothing'];

    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.innerText = optionText;
        select.appendChild(option);
    });

    form.appendChild(label);
    form.appendChild(select);

    const targetDiv = document.getElementById('targetDiv');
    targetDiv.appendChild(form);
}