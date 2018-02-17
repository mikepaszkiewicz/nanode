import nano from './init'

export async function receive() {
  console.log(await nano.account(process.env.ACCOUNT_PRIVATE_KEY).receive())
}

receive()
