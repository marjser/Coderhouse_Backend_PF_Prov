
// FUNCTIONS 

const setPrice = priceInput => {
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




const dataJSON = document.getElementById("dataJSON")

const allData = JSON.parse(dataJSON.textContent)

const {cartId, cartDocs, user} = allData



let totalArrayNew = []

cartDocs.forEach(product => {
  totalArrayNew.push(product.price*product.quantity)
})



const butDeleteAllProd = document.getElementById("deleteAllProdFromCart");

const butDeleteCart = document.getElementById("deleteCart");

// CALCULO TOTAL PRECIO

const productCont = document.getElementsByClassName("productContainer")


let totalArray = []

for (let i = 0; i < productCont.length; i++) {
  const prodId = productCont[i].id
  const prodQuant = productCont[i].children[5].title
  const prodPrice = productCont[i].children[6].title
  const prodCalculate = prodQuant*prodPrice
  document.getElementsByName(prodId)[0].innerText = `Total: $${prodCalculate}`
  totalArray.push(prodCalculate)
}


let totalSum = totalArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

document.getElementById("totalCart").innerText = `Total del carrito: $${setPrice(totalSum)}`

// CONTAINER PRODUCTOS

const newCartContainer = document.getElementById("newCartContainer")

console.log(cartDocs)

if (cartDocs.length == 0) {
  newCartContainer.textContent = 'Tu carrito está vacio'
}

cartDocs.forEach(product => {

  const productDiv = document.createElement('div');
  const ptitle = document.createElement('p')
  const pDescription = document.createElement('p')
  const pCode = document.createElement('p')
  const pPrice = document.createElement('p')
  const pStock = document.createElement('p')
  const pCate = document.createElement('p')
  const pQuantity = document.createElement('p')
  const pTotalProd = document.createElement('p')
  productDiv.id = product.id

  ptitle.textContent = `Title: ${product.title}`
  pDescription.textContent = `Description: ${product.description}`
  pCode.textContent = `Code: ${product.code}`
  
  
  
  if (product.stock == 0) {
    product.stock = 'No disponible'
  } else {
    product.stock = 'Disponible'
  }
  
  pStock.textContent = `Stock: ${product.stock}`
  
  pCate.textContent = `Category: ${product.category}`

  pQuantity.textContent = `Cantidad: ${product.quantity}`
  pPrice.textContent = `Price: $${setPrice(product.price)}`
  pTotalProd.textContent = `Total producto: $${setPrice(product.price*product.quantity)}`

  productDiv.appendChild(ptitle)
  productDiv.appendChild(pDescription)
  productDiv.appendChild(pCode)
  productDiv.appendChild(pStock)
  productDiv.appendChild(pCate)
  productDiv.appendChild(pPrice)
  productDiv.appendChild(pQuantity)
  productDiv.appendChild(pTotalProd)

  const form = document.createElement('form')

  const input = document.createElement('input')
  input.setAttribute('type', 'number')
  form.appendChild(input)

  const submitButton = document.createElement('input')
  submitButton.setAttribute('type', 'submit')
  submitButton.setAttribute('value', 'Agregar cantidad del producto')

  
  submitButton.addEventListener('click', (e) => {
    e.preventDefault()


    const quantityData = {
      prodId: product.prodId,
      quantity: Number(input.value) || 1,
      operation: 'add'
    }

    fetch(`/carts/${cartId}`, {
      method: 'PUT',
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

  // BOTÓN PARA ELIMINAR CANTIDAD DE PRODUCTO DEL CARRITO
  
  const subtractButton = document.createElement('input')
  subtractButton.setAttribute('type', 'submit')
  subtractButton.setAttribute('value', 'Restar cantidad al carrito')
  
  subtractButton.addEventListener('click', (e) => {
    e.preventDefault()

    console.log('subtract button')

    const quantityData = {
      prodId: product.prodId,
      quantity: Number(input.value),
      subtract: true
    }

    if (!quantityData.quantity) {
      alert('Debe especificar una cantidad')
    }

    if (quantityData.quantity >= product.quantity) {
      alert('Cantidad no permitida')
    }

    fetch(`/carts/${cartId}`, {
      method: 'PUT',
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
  form.appendChild(subtractButton)
  
  productDiv.appendChild(form)

  // BOTÓN PARA ELIMINAR PRODUCTO DE CARRITO

  const deleteProd = document.createElement('button')
  deleteProd.textContent = 'Eliminar producto del carrito';

  deleteProd.addEventListener('click', (e)=>{
    e.preventDefault()

    fetch(`/carts/${cartId}/product/${product.prodId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
    
    location.reload()
  })

  productDiv.appendChild(deleteProd)

  newCartContainer.appendChild(productDiv)
  

})



// BOTÓN PARA ELIMINAR CARRITO

butDeleteCart.addEventListener("click", () => {

  fetch(`/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));


})

// BOTÓN PARA AGREGAR CANTIDAD DESDE EL PRODUCTO


$(document).ready(function() {
  $('.productContainer').on('submit', 'form', function(event) {

      event.preventDefault();
      
      console.log(event.target.children)

      const quantityData = {
        prodId: event.target.children[0].name,
        quantity: event.target.children[0].value,
      }
      
      if (!quantityData.quantity) {
        return alert('Debe definir una cantidad para agregar')
      }

        console.log(quantityData)
      

      fetch(`/carts/${cartId}`, {
        method: 'PUT',
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
      

  });
});




// BOTÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO

document.getElementById('cartContainer').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON'  && event.target.className === "deleteProdFromCart") {
    const prodId = event.target.name  
    
    
    fetch(`/carts/${cartId}/product/${prodId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
      
      location.reload()
   
  }
});



// BOTÓN PARA TERMINAR COMPRA

const purchaseButton = document.getElementById('purchaseButton')

purchaseButton.addEventListener('click', (e)=>{
  e.preventDefault()
  
  if (cartDocs.length == 0) {
    return alert('No puedes terminar tu compra si tu carrito está vacio')
  }

  const url = `/carts/purchase/${cartId}`
  window.location.href = url




})


