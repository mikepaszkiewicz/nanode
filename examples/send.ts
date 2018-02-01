import Nano from './init'

export async function send() {
  //send amount can't be a fraction rn
  const result = await Nano.send('0.01', process.env.RECIPIENT_WALLET)
  console.log(result)
  return result
}

send()
