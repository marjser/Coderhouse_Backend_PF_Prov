
const mongoose = require('mongoose')

const userCollection = 'user'

const userSchema = new mongoose.Schema({
	status: {
        type: Boolean,
        default: true
    },
	first_name: String,
	last_name: String,
	age: Number,
	address: {
		type: String,
		default: null,
	},
	phoneNumber: {
		type: Number,
		default: null
	},
	email: {
		type: String,
		unique: true
	},
	userName: {
		type: String,
		unique: true
	},
	password: String,
	role: {
		type: String,
		enum: ['client', 'admin', 'premium'],
		default: 'client',
	},
	profile: {
		type: String,
		default: null
	},
	documents: {
		type: [
			{
				name: {
					type: String,
					enum: [
						'userIdentification',
						'userAddress',
						'userAccount',
					]
				},
				reference: String,
			}
		],
		validate: [arrayLimit, '{PATH} exceeds the limit of 3'] ,
	},
	githubId: Number,
	githubUsername: String,
	products: {
        type: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
			status: {
				type: Boolean,
				default: true
			},
            },
        ],
    },
	carts: {
        type: [
            {
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'cart',
            },
			status: {
				type: Boolean,
				default: true
			},
            },
        ],
    },
	sales: {
        type: [
            {
            sale: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sale',
            },
			status: {
				type: Boolean,
				default: true
			},
            },
        ],
    },
	last_connection: {
		type: Date,
	}
})

function arrayLimit(val) {
	return val.length <= 3;
  }


const Users = mongoose.model(userCollection, userSchema)


module.exports = Users