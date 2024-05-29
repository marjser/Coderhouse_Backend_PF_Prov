
const ticketGenerator = (saleData) => {
        
    let saleDetailRaw = saleData.saleDescription.split('&');
    let saleDetail = ''
        
    saleDetailRaw.pop()
    
    saleDetailRaw.forEach(prod => {
        const prodDetail = prod.split('-')

        saleDetail += `${prodDetail[2]} - ${prodDetail[1]} - ${prodDetail[3]} x $${prodDetail[4]} = $${prodDetail[5]}\n`;
    });
    
    const saleDateRaw = saleData.createdAt.toString()
    const saleDate = saleDateRaw.split('(')[0]

    const ticketFinal = 
`Ticket id: ${saleData.id}
Code: ${saleData.code}
Fecha de compra: ${saleDate} 
Detalle de compra:
${saleDetail}
--------------------------------
Total: $${saleData.total}
--------------------------------
id-cliente: ${saleData.user}
`

    return ticketFinal
}

module.exports = ticketGenerator
