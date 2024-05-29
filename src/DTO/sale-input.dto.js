

class NewSaleDto {
    constructor(user, cartDocs){
        this.code = 'code'
        this.saleDescription = this.setDescription(cartDocs)
        this.total = this.setTotal(cartDocs)
        this.user = user.id
    }
    

    setDescription = (cartDocs) => {
        let saleDetail = "";
        

        cartDocs.forEach(prod => {
            const prodId = prod.id
            saleDetail += `${prodId}-${prod.title}-${prod.code}-${prod.quantity}-${prod.price}-${prod.quantity*prod.price}&`;
            
        });


        return saleDetail

    }
    
    setTotal = (cartDocs) => {
        let saleTotal = []
        
        cartDocs.forEach(prod => {
            saleTotal.push(prod.quantity*prod.price)
        });
        
        let saleSum = saleTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return saleSum
    }
}

module.exports = NewSaleDto


