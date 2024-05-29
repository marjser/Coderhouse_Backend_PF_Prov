
const jsonData = document.getElementById("jsonData")
const optionsContainer = document.getElementById("options")


const {cart, saleData, first_name} = JSON.parse(jsonData.textContent)


const ticketData = document.getElementById("ticket")
const ticketRender = document.getElementById("ticketRender")

ticketData.style.display = 'none' 

const ticketDataText = ticketData.innerText

ticketRender.innerText = ticketDataText


if (cart) {
    const newCartInfo = document.createElement('p')
    newCartInfo.textContent = 'Los productos que no se pudieron comprar por falta de stock se ingresaron en un nuevo carrito'
    optionsContainer.appendChild(newCartInfo)

    const newCartButton = document.createElement('button')
    
    const buttonName = document.createTextNode('Ver tu nuevo carrito')
    
    newCartButton.appendChild(buttonName)

    newCartButton.addEventListener('click', (e)=>{
        e.preventDefault()
        
      
        const url = `/carts/${cart}`
        window.location.href = url
      
    })
    
    optionsContainer.appendChild(newCartButton)

}


