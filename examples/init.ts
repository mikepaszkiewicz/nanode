require('dotenv').config()

import Nano from '../index'

const nano = new Nano({
  api_key: process.env.API_KEY,
  url: `https://www.nanode.co`,
  origin_address: process.env.SENDER_WALLET,
  origin_key: process.env.SENDER_WALLET_PRIVATE_KEY,
  debug: true
})

export default nano
