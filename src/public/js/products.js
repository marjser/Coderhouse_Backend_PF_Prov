
// FUNCTIONS 

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

// CONSOLE

const CONSOLER = (switcher, input) => {
  if (switcher == 'on') {
    console.log(input)
  }
}



const consoleSwitch = 'on'

// DATA FROM SERVER

const jsonData = document.getElementById("jsonData")
const allData = JSON.parse(jsonData.textContent)

const {user, productsDocs, cartDocs} = allData

let cartIdjson = allData.cartId || false
console.log(`Cart Id = ${cartIdjson}`)

console.log(productsDocs)

let admin
let client
let premium
let userIdJdon

if (user) {
  if (user.role === 'admin') {admin = true} 
  if (user.role === 'client') {client = true} 
  if (user.role === 'premium') {premium = true} 
  userIdJdon = user.id
}


CONSOLER(consoleSwitch, productsDocs)
//console.log(user)



// ADMIN ELEMENTS

const adminContainer = document.getElementById("adminContainer")

const adminClass = document.getElementsByClassName("admin")

const clientClass = document.getElementsByClassName("client")



// NEW PRODUCTS CONTAINER

const productsContainerTitle = document.getElementById("productsContainerTitle")
const newProducContainer = document.getElementById("newProducContainer")

if (productsDocs.length == 0) {
  productsContainerTitle.textContent = 'No hay productos disponibles'
}

productsDocs.forEach(product => {

  const productDiv = document.createElement('div');
  productDiv.setAttribute('name', product.owner)
  console.log(productDiv)
  const ptitle = document.createElement('p')
  const pDescription = document.createElement('p')
  const pCode = document.createElement('p')
  const pPrice = document.createElement('p')
  const pStock = document.createElement('p')
  const pCate = document.createElement('p')
  productDiv.id = product.id

  ptitle.textContent = `Title: ${product.title}`
  pDescription.textContent = `Description: ${product.description}`
  pCode.textContent = `Code: ${product.code}`
  pPrice.textContent = `Price: $${setPrice(product.price)}`
  pStock.textContent = `Stock: ${product.stock}`

  pCate.textContent = `Category: ${product.category}`

  productDiv.appendChild(ptitle)
  productDiv.appendChild(pDescription)
  productDiv.appendChild(pCode)
  productDiv.appendChild(pPrice)
  if(admin) {productDiv.appendChild(pStock)}
  productDiv.appendChild(pCate)
  newProducContainer.appendChild(productDiv)
  

})


// PRODUCTS BUTTONS

  for (const product of newProducContainer.children ) {
    const productOwner = product.attributes.name.value
    
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
        userId: userIdJdon || null
      }


      const fetchProp = {
        method:'PUT',
        url: `/carts/${cartIdjson}` 
      } 
      
      if (!cartIdjson) {
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
        product.appendChild(form)        
      }
    } else if (!user) {
      console.log('no hay user')
      console.log('user: ',user)
      product.appendChild(form)
    }

    // See product in detail

    const seeProduct = document.createElement('button')
    seeProduct.textContent = 'Ver producto'

    seeProduct.addEventListener('click', (e)=>{
      e.preventDefault()

      const url = `/products/${product.id}`
      
      window.location.href = url


    })

    product.appendChild(seeProduct)

  }



// ADMIN BUTTONS


  for (const product of newProducContainer.children ) {
    const productOwner = product.attributes.name.value

    const form = document.createElement('form')

    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    form.appendChild(input)

    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('value', 'Agregar Stock')

    submitButton.addEventListener('click', (e) => {
      e.preventDefault()

      const stockData = {
        prodId: product.id,
        stock: Number(input.value)
      }

      if (!stockData.stock) {return alert('Must specify the stock')}

      fetch(`/products/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData),
      })
      .then(response => response.json())
      .then(data => {
        const message = data.message
        console.log(message)
        alert(message);
        location.reload()
      })
      .catch(error => {
        console.error('Error making PATCH request:', error);
      });
    })
    form.appendChild(submitButton)
    if (user || admin) {
      if (admin) {
        product.appendChild(form)

      } else if (user.id == productOwner) {
        console.log('user: ',user)
        product.appendChild(form)        
      }
  }
  }



let userId

if (document.getElementById("userData")) {

  userId = document.getElementById("userData").title
  
} else {console.log('no hay datos')}

const butAddCart = document.getElementById("addToCart");
const butDeleteAllProd = document.getElementById("deleteAllProdFromCart");
const butDeleteCart = document.getElementById("deleteCart");


// CART OPTIONS

const cartOptions = document.getElementById("cartOptions")

if (!cartIdjson) {
  const createCartButton = document.createElement('button');
    
  createCartButton.textContent = 'Crear Carrito Nuevo';

  createCartButton.addEventListener('click', () => {

    console.log('Boton Crear Carrito')
  
  const userData = {
    userId
  }
      fetch('/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));


        location.reload()
  })

  cartOptions.appendChild(createCartButton);
}



if (cartIdjson) {
  const seeCartButton = document.createElement('button');
    
  seeCartButton.textContent = 'Ver Carrito';

  seeCartButton.addEventListener('click', () => {
    console.log('Boton Ver Carrito')

    const url = `/carts/${cartIdjson}`
    window.location.href = url

  })

  cartOptions.appendChild(seeCartButton);
}

let cartId = document.getElementById('productsContainer').className


if (cartDocs) {
  const totalCart = document.createElement('h3')

  let totalArrayNew = 0

  cartDocs.forEach(product => {
  totalArrayNew += product.price*product.quantity
})

  totalCart.textContent =`Total de tu carrito: $${setPrice(totalArrayNew)}`
  cartOptions.appendChild(totalCart);
}


// GESTIÓN DE LOS QUERY PARAMS EN LA URL

const querys = document.location.search

const totalPages = Number(document.getElementById("totalPages").title)


const urlQuerys = {
  page: Number(document.getElementById('page').title),
  totalPages: totalPages,
  sort: false,
  cat: false,
  limit: false,
  query: false,
  stock: false,
}



function createUrl () {
  let url = `/products?page=${urlQuerys.page}`
  if (urlQuerys.sort) {url = url+`&sort=${urlQuerys.sort}`}
  if (urlQuerys.cat) {url = url+`&cat=${urlQuerys.cat}`}
  if (urlQuerys.limit) {url = url+`&limit=${urlQuerys.limit}`}
  if (urlQuerys.query) {url = url+`&query=${urlQuerys.query}`}
  
  return url
}

function findQuerys () {
  const querysSplit = querys.split('&') 
  querysSplit.shift()
  for (i of querysSplit) {
    const query = i.split('=')
    if (query[0] == 'sort') {urlQuerys.sort = query[1]}
    if (query[0] == 'limit') {urlQuerys.limit = query[1]}
    if (query[0] == 'cat') {urlQuerys.cat = query[1]} 
    if (query[0] == 'query') {urlQuerys.query = query[1]} 
  }
}


findQuerys()



// BOTÓN PARA LOGOUT

if (document.getElementById('logOutForm')) {
  const form = document.getElementById('logOutForm')
  
  form.addEventListener('submit', async e=> {
    try {
      e.preventDefault()
  
      const fetchParams = {
          url: '/auth/logout',
          headers: {
              'Content-type': 'application/json',
          },
          method: 'POST',
      }            
      const response = await fetch(fetchParams.url, {
          headers: fetchParams.headers,
          method: fetchParams.method,
          redirect: 'follow'
      })

      
      if (response.ok) {

        alert('Logged out successfully')
        window.location.href = '/products'
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  })
}



// AGREGAR NUEVO PRODUCTO

const newProdAdd = document.getElementById("newProdAdd")

newProdAdd.addEventListener("click", (event) => {
  event.preventDefault()

  const newProdInfo = {
    userOwner: user.id || 'admin',
    title: document.getElementById("newProdTitle").value,
    description: document.getElementById("newProdDes").value,
    code: document.getElementById("newProdCode").value,
    price: document.getElementById("newProdPrice").value,
    stock: document.getElementById("newProdStock").value,
    category: document.getElementById("newProdCat").value,
    image: document.getElementById("newProdImage").value,

  }

  if (!newProdInfo.title || !newProdInfo.code || !newProdInfo.price || !newProdInfo.stock || !newProdInfo.category || !newProdInfo.description ) {
    return alert('Faltan datos del producto')
  } else {
    
    console.log(newProdInfo)
    
    fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProdInfo),
    })
    .then(response => response.json())
    .then(data => {
      alert('Product Added')
      location.reload()
  })
    .catch(error => console.error(error));
  }
})


// BÚSQUEDA POR NOMBRE

const searchButton = document.getElementById("seachQuery")

searchButton.addEventListener("click", (event) => {
  event.preventDefault()
  const prodTitle = document.getElementById("prodTitle").value

  urlQuerys.query = prodTitle
  urlQuerys.page = 1
  const newURL = createUrl()
  window.location.href = newURL
})

// BOTÓN PARA ELIMINAR BÚSQUEDA

if (urlQuerys.query) {
  
  const divSearch = document.getElementById('searchContainer');
  const searchInfo = document.createElement('p');
  
  const buttonSearchCancel = document.createElement('button');
  searchInfo.textContent = `Se buscó: "${urlQuerys.query}"`
  
  buttonSearchCancel.setAttribute('id', 'buttonSearchCancel');
  buttonSearchCancel.textContent = 'Eliminar Búsqueda';
  
  divSearch.appendChild(searchInfo)
  divSearch.appendChild(buttonSearchCancel);

  buttonSearchCancel.addEventListener("click", () => {
    urlQuerys.query = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}



// BOTONES DE CAMBIO DE PÁGINA

const butNextPage = document.getElementById("nextPageButton")

if (butNextPage) {
  butNextPage.addEventListener("click", () => {
    const nextPage = document.getElementById("nextPageButton").title

    urlQuerys.page = nextPage
    const newURL = createUrl()
    window.location.href = newURL

  })
}

const butPrevPage = document.getElementById("prevPageButton")


if (butPrevPage) {
  butPrevPage.addEventListener("click", () => {
    const prevPage = document.getElementById("prevPageButton").title

    urlQuerys.page = prevPage
    const newURL = createUrl()
    window.location.href = newURL
  }) 
}

// BOTÓN PARA LIMITAR RESULTADOS DE BÚSQUEDA

const limitInputButton = document.getElementById("limitInputButton")

limitInputButton.addEventListener("click", (e) => {
  e.preventDefault()
  const limitInput = document.getElementById("limitInput").value

  urlQuerys.limit = limitInput
  urlQuerys.page = 1
  const newURL = createUrl()
  window.location.href = newURL
})

// BOTÓN PARA ELIMINAR LÍMITE DE RESULTADOS

if (urlQuerys.limit) {
  
  const limitContainer = document.getElementById('limit-container');
  
  const buttonLimitCancel = document.createElement('button');
  
  buttonLimitCancel.setAttribute('id', 'buttonLimitCancel');
  buttonLimitCancel.textContent = 'Eliminar límite';
  
  limitContainer.appendChild(buttonLimitCancel);

  buttonLimitCancel.addEventListener("click", () => {
    urlQuerys.limit = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}


// BOTONES PARA ORDENAR

const sortAscButton = document.getElementById('sortAscButton')

if (urlQuerys.sort != 'asc' || urlQuerys.sort == false) {
  sortAscButton.addEventListener("click", () => {

        urlQuerys.sort = 'asc'
        console.log(urlQuerys)

        const newURL = createUrl()
        console.log(newURL)
        window.location.href = newURL

  })
}


const sortDescButton = document.getElementById('sortDescButton')

if (urlQuerys.sort != 'desc' || urlQuerys.sort == false) {
  sortDescButton.addEventListener("click", () => {

        urlQuerys.sort = 'desc'
        console.log(urlQuerys)

        const newURL = createUrl()
        console.log(newURL)
        window.location.href = newURL

  })
}

// BOTÓN PARA ELIMINAR ORDEN POR PRECIO

if (urlQuerys.sort) {
  
  const divSort = document.getElementById('sortcancelButton');
  
  const buttonSortCancel = document.createElement('button');
  
  buttonSortCancel.setAttribute('id', 'buttonSortCancel');
  buttonSortCancel.textContent = 'Eliminar Orden';
  
  divSort.appendChild(buttonSortCancel);

  buttonSortCancel.addEventListener("click", () => {
    urlQuerys.sort = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}



// BOTÓN PARA CREAR CARRITO

let butCreateCart

if (!cartId) {
  cartId = 'new'
  butCreateCart = document.getElementById("createCart")
} 



let cartName



if (butCreateCart) {
  butCreateCart.addEventListener("click", () => {
  console.log('crear carrito')
  
  const userData = {
    userId
  }
      fetch('/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));


        location.reload()
  
})
}

// BOTÓN PARA BORRAR CARRITO

if (butDeleteCart) {

butDeleteCart.addEventListener("click", () => {


  fetch(`/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify(patchData),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

  location.reload()
  
})
}

// BOTÓN PARA AGREGAR PRODUCTO AL CARRITO



document.getElementById('productsContainer').addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON' && event.target.className === "AddProdToCart") {
      console.log('se agregó producto')
      const prodId = event.target.name

      const userData = {
        userId
      }
      
      fetch(`/carts/${cartId}/product/${prodId}`, {
          method: 'PATCH',
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
        .catch(error => console.error(error));       
  }
});

if (user) {
  if (user.role == 'admin') {
    for (let i = 0; i < adminClass.length; i++) {
      adminClass[i].style.display = 'block'
      
    }
  
    for (let i = 0; i < clientClass.length; i++) {
      clientClass[i].style.display = 'none'
      
    }
  } 

}

const addProductDiv = document.getElementById('addProductDiv')

if (admin || premium) {
  addProductDiv.style.display = 'block'
}