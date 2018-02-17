import nano from './init'

export default async function open() {
  //create a new key
  // const target = await nano.key.create()
  // console.log(target)

  //open block with send's hash
  const account = nano.account(process.env.ACCOUNT_PRIVATE_KEY)
  await account.open()
}

open()
