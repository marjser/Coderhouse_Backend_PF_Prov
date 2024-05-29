
const jsonData = document.getElementById("jsonData")

const {cartId, cartDocs, cartSend} = JSON.parse(jsonData.textContent)


const productCont = document.getElementsByClassName("productContainer")


cartJSON.style.display = 'none' 

const cartContainer = document.getElementById("cartContainer")

let totalArray = []

cartDocs.forEach(prod => {
  const div = document.createElement('div');

  div.textContent =   `Producto: ${prod.title} - Code: ${prod.code} - Cat: ${prod.category} - Precio/unidad: $${prod.price} - Cantidad: ${prod.quantity} - Total: $${prod.quantity*prod.price}.00`


  totalArray.push(prod.price*prod.quantity)

  cartContainer.appendChild(div);
});






let totalSum = totalArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


document.getElementById("totalCart").innerText = `Total del carrito: $${totalSum}`


document.getElementById("purchase").addEventListener("click", ()=> {
    console.log("boton purchase")


    
    const fetchProp = {
        url: `/carts/purchase/${cartId}`,
        method: 'POST'
    }

    fetch(fetchProp.url, {
        method: fetchProp.method,
        headers: {
        'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const ticketId = data.ticketId
        console.log(data)
        window.location.href = `/ticket/${ticketId}`
    })
    .catch(error => {
    console.error('Error making PUT request:', error);
    })
    
})


