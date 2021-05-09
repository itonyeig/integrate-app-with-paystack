const express = require('express')
const https = require('https');
const bodyParser = require('body-parser');
const app = express()
//get and destructure variables from config 
const { hostname, secretKey, port, } = require('./config')


app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
  
  res.sendFile(__dirname +'/index.html')
})


//initiate 
app.post('/', (req, res) => {
  //get out the user keyed in figures
  let email = req.body.email
  let amount = req.body.amount
  let fName = req.body.fname
  let lNmae = req.body.lname
  
  console.log(email,  fName, lNmae);

  //set the parameters based on the users input
  const params = JSON.stringify({
  "email": email,
  "amount": amount * 100,
  "channels":['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
})
// object that will be fed into https request
  const options = {
  hostname: hostname,
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json'
  }
}

//https request with response
const request = https.request(options, response => {
  let data = ''
  response.on('data', (chunk) => {
      data += chunk
  });

  response.on('end', () => {
    //parse the data into json object and store
      let redirecturl = JSON.parse(data)
      console.log(redirecturl);

      // redirect the user to paystack payment pop up
      res.redirect(redirecturl.data.authorization_url)
  })
  }).on('error', error => console.error(error))

  request.write(params)
  request.end()
})







app.listen(port, () => console.log(`Server listening on port ${port}!`))