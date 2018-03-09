require('dotenv').config()

const {Nano, NanodeRepresentative} = require('../dist/index')

const nano = new Nano({
  apiKey: process.env.API_KEY,
  debug: true
})

async function openNewAccount() {
  const {privateKey, address} = await nano.key.create()

  // External step required: send some funds to your newly
  // generated address to be able to open the account
  console.log(address)

  await nano.account(privateKey).open()
}

async function sendFunds(privateKey) {
  await nano
    .account(privateKey)
    .send(
      0.0001,
      'xrb_1nanode8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzffeg'
    )
}

async function receiveFunds(privateKey) {
  await nano.account(privateKey).receive()
}

async function checkBalance(address) {
  return nano.accounts.nanoBalance(address)
}

async function run() {
  console.log(await checkBalance(NanodeRepresentative))
}

run()
