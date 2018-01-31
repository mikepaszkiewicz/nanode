require('dotenv').config()

import Nano from '../index'

setTimeout(async () => {
  const nano = new Nano({
    api_key: process.env.API_KEY,
    url: `https://rpc.raiblocks.club`,
    origin_address: process.env.SENDER_WALLET,
    origin_key: process.env.SENDER_WALLET_PRIVATE_KEY
  })

  await nano.send('0.1', process.env.RECIPIENT_WALLET)
}, 5000)
