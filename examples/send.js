require('dotenv').config()
var Nano = require('../index')

async function run() {
  const API_KEY = process.env.API_KEY
  const nano = new Nano({
    apiKey: API_KEY
  })

  const nanoAccount = nano.account(process.env.PRIVATE_KEY)

  nanoAccount.nanoBalance().then(balance => {
    console.log('you have', balance)
  })

  var recievingAddress = process.env.RECEIVING_ADDRESS
  var sendAmount = 1

  nano
    .send(process.env.PRIVATE_KEY, sendAmount, recievingAddress)
    .then(output => {
      console.log(output)
    })
    .catch(err => {
      console.error(err)
    })
}

run()
