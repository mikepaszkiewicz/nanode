debugger
import Nano from './init'

export async function send() {
  const result = await Nano.send('0.1', process.env.RECIPIENT_WALLET)
  console.log(result)
  return result
}

send()
