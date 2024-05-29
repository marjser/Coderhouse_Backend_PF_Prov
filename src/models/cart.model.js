const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')



const cartCollection = 'cart'


const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },   
            quantity: Number,
            },
        ],
    },
    status: {
        type: Boolean,
        default: true
    }
    ,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }
})

cartSchema.plugin(mongoosePaginate)

const carts = mongoose.model(cartCollection, cartSchema)

module.exports = carts