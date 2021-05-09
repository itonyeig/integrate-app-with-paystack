require('dotenv').config()

module.exports = {
  hostname: process.env.API_URL,
  secretKey: process.env.API_KEY,
  port: process.env.PORT,
  method: process.env.METHOD
}

