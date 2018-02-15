import Nano from './init'

export default async function open() {
  try {
    //create a new key
    const target = await Nano.key.create()

    console.log(`Initializing account ${target.account} with funds..`)

    //send new account init funds from our walet
    const hash = await Nano.send('0.01', target.account)

    //open block with send's hash
    const result = await Nano.open(
      hash,
      process.env.DEFAULT_REP,
      target.private,
      target.public
    )

    return {result, target}
  } catch (err) {
    throw new Error(err.message)
  }
}

open()
