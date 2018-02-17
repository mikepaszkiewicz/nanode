require('dotenv').config()

import Nano from '../index'

const nano = new Nano({
  api_key: process.env.API_KEY,
  url: `https://api.nanode.co`,
  debug: true
})

export default nano
