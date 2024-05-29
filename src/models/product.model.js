const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productCollection = 'product'


const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    code: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    },
    
    stock: {
        type: Number,
        required: true
    },
    
    category: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: 'admin',
    },
    thumbnails: {
        type: [
            {
                thumbnail: {
                    type:String,
                }
            }
        ],
    },    
    status: {
        type: Boolean,
        default: true
    }
})

productSchema.plugin(mongoosePaginate)



const products = mongoose.model(productCollection, productSchema)



module.exports = products