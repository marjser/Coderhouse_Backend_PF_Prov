
const jsonData = document.getElementById("jsonData")

const {lastSale, oldSales, user} = JSON.parse(jsonData.textContent)




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




const premiumButton = document.getElementById('premiumUser')

premiumButton.addEventListener('click', (e)=> {  
  const url = `/users/${user.id}/documents`
  window.location.href = url
})

let saleArray


const saleDetailGenerator = (saleArray) => {
  const saleDetailRaw = saleArray.saleDesc.split('&')
  
  let saleDetail = ''
          
  saleDetailRaw.pop()
  
  saleDetailRaw.forEach(prod => {
      const prodDetail = prod.split('-')
    
      saleDetail += `${prodDetail[2]} - ${prodDetail[1]} - ${prodDetail[3]} x $${setPrice(prodDetail[4])} = $${setPrice(prodDetail[5])}\n`;
  });
 
  return saleDetail
}



const lastSaleInput = document.getElementById("lastSaleInput")
const oldSalesDiv = document.getElementById("oldSales")
lastSaleInput.style.display = 'none' 

let lastSaleDetail
if (lastSale) {
  lastSaleDetail = saleDetailGenerator(lastSale)
}





const profileSalesContainer = document.getElementById("profileSales")

const lastSaleDiv = document.createElement('div')

if (lastSale) {
  lastSaleDiv.innerHTML = `<p>Fecha de compra: ${lastSale.createdAt}</p>
  <p>Descripción: ${lastSaleDetail}</p>
  <p>Total: $${setPrice(lastSale.total)}</p>
  `
  
  profileSalesContainer.appendChild(lastSaleDiv)

}


if (oldSales.length > 0) {
  const oldSalesTitle = document.createElement('h4')
  oldSalesTitle.textContent = 'Tus compras anteriores'
  oldSalesDiv.appendChild(oldSalesTitle)
}

// VENTAS ANTERIORES


for (const [index, sale] of oldSales.entries()) {
    if ( index === 5 ) break;
  


  const saleDiv = document.createElement('div') 
  const saleText = document.createElement('p')

  const date = sale.createdAt.substr(0, 10)
  const saleTotal = setPrice(sale.total)
  
  saleText.textContent = `Fecha de compra: ${date} - Total: ${saleTotal}`

  saleDiv.appendChild(saleText)


  const saleDetailshow = document.createElement('button')
    
  const buttonShowName = document.createTextNode('Ver detalle de compra')
  
  saleDetailshow.appendChild(buttonShowName)

   const saleDetail = document.createElement('p')


saleDetail.textContent = saleDetailGenerator(sale)

saleDiv.appendChild(saleDetail)

saleDetail.style.display = 'none'

const saleDetailHide = document.createElement('button')
    
const buttonHideName = document.createTextNode('Ocultar detalle de compra')

saleDetailHide.appendChild(buttonHideName)

saleDetailHide.style.display = 'none'

  saleDetailshow.addEventListener('click', (e)=>{

      e.preventDefault()
    
    saleText.style.display = 'none'
    saleDetail.style.display = 'inline'
    saleDetailHide.style.display = 'block'
    
    saleDetailshow.style.display = 'none'
    

})

saleDetailHide.addEventListener('click', (e)=>{
  
  e.preventDefault()
  
  saleText.style.display = 'inline'
      saleDetail.style.display = 'none'
      
      saleDetailHide.style.display = 'none'
    saleDetailshow.style.display = 'block'


})

saleDiv.appendChild(saleDetailshow)   
saleDiv.appendChild(saleDetailHide)   


  oldSalesDiv.appendChild(saleDiv)



}

const premiumUserButton = document.getElementById('premiumUser')




