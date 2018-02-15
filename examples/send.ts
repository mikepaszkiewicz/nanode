import Nano from './init'

export async function send() {
  //send amount can't be a fraction rn
  const hash = await Nano.send('0.01', process.env.RECIPIENT_WALLET)
  console.log(hash)
  return hash
}

send()
