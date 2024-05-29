
const generateCode = (id) => {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();

    
    const finalDate = `${year}${month}${day}`
    const numCode = Math.round(Math.random() * 100000)


    const finalCode = finalDate+id+numCode.toString().slice(0,3)

    return finalCode

}



module.exports = generateCode