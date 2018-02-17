import nano from './init'

export default async function open() {
  try {
    //create a new key
    const target = await nano.key.create()

    //open block with send's hash
    const account = nano.withAccount(process.env.SENDER_WALLET_PRIVATE_KEY)
    const result = await account.open()

    return {result, target}
  } catch (err) {
    throw new Error(err.message)
  }
}

open()
