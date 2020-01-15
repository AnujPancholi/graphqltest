require('dotenv').config()

module.exports = {
	API_PORT: process.env.API_PORT ? parseInt(process.env.API_PORT) : null   
}