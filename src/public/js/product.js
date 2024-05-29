
const setPrice = (priceInput) => {
    const priceRaw = priceInput.toString()
    const priceArray = priceRaw.split('.')
    let finalPrice = ''
    if (priceArray.length == 1) {
      finalPrice = priceArray[0]+'.00'
    } else {
      const decimal = priceArray[1]
      if (decimal.length == 1) {
        finalPrice = priceArray[0]+'.'+decimal+'0'
      } else {
        finalPrice = priceArray[0]+'.'+decimal
      }
    }
  
    return finalPrice
  }


const payloadJson = document.getElementById('payload').textContent
const productContainer = document.getElementById('productContainer')
const chatToOwner = document.getElementById('chatToOwner')



const payload = JSON.parse(payloadJson)

const {user, product} = payload 

console.log(product)

const cart = user.cart || null
let cartId

if (cart) {
    cartId = cart.id || null
}

const productTitle = document.getElementById('productTitle')

productTitle.textContent = product.title



const productDiv = document.createElement('div');
  productDiv.setAttribute('name', product.owner)
  const pDescription = document.createElement('p')
  const pCode = document.createElement('p')
  const pPrice = document.createElement('h3')
  const pStock = document.createElement('p')
  const pCate = document.createElement('p')
  productDiv.id = product.id

  pDescription.textContent = `Description: ${product.description}`
  pCode.textContent = `Code: ${product.code}`
  pPrice.textContent = `Price: $${setPrice(product.price)}`
  pStock.textContent = `Stock: ${product.stock}`

  pCate.textContent = `Category: ${product.category}`

  productDiv.appendChild(pDescription)
  productDiv.appendChild(pCode)
  productDiv.appendChild(pCate)
  productDiv.appendChild(pPrice)
  productContainer.appendChild(productDiv)


  const productOwner = productDiv.attributes.name.value
    
    const form = document.createElement('form')

    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    form.appendChild(input)


    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('value', 'Agregar producto al carrito')

    submitButton.addEventListener('click', (e) => {
      e.preventDefault()

      const quantityData = {
        prodId: product.id,
        quantity: Number(input.value) || 1,
        userId: user.id || null
      }


      const fetchProp = {
        method:'PUT',
        url: `/carts/${cartId}` 
      } 
      


      if (!cartId) {
        fetchProp.method = 'POST'
        fetchProp.url = '/carts'
      }

      fetch(fetchProp.url, {
        method: fetchProp.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantityData),
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

        
    if (user || admin) {
      console.log('hay user')
      if (user.id != productOwner) {
        console.log('user: ',user)
        productDiv.appendChild(form)        
      }
    } else if (!user) {
      console.log('no hay user')
      console.log('user: ',user)
      productDiv.appendChild(form)
    }

    chatToOwner.addEventListener('click', (e)=>{

      const body = {
        from: user.id,
        to: product.owner
      }

      console.log(productOwner)

      fetch(`/chat/${product.owner}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const {payload} = data
        const {chatId} = payload
        const message = data.message
        console.log(message)


        const url = `/chat/${chatId}`
        window.location.href = url
      })
      .catch(error => {
        console.error('Error making PUT request:', error)
      })
          

    })