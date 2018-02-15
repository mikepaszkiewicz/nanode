import Nano from './init'

export async function balance() {
  //Check receiving account for pending transactions
  const accountBalance = await Nano.account.balance(
    process.env.RECIPIENT_WALLET
  )
  //get most recent hash and balance block
  console.log(accountBalance)
}

export async function blocks() {
  //Check receiving account for pending transactions
  const accountBalance = await Nano.account.block_count(
    process.env.RECIPIENT_WALLET
  )
  //get most recent hash and balance block
  console.log(accountBalance)
}

balance()
blocks()
