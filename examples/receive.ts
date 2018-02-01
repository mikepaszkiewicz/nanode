import Nano from './init'

export async function receive() {
  //Check receiving account for pending transactions
  const pendingBlocks = await Nano.account.history(process.env.RECIPIENT_WALLET)
  if (!pendingBlocks.history.length) {
    throw new Error('No pending blocks to receive for this account')
  }

  //get most recent hash and receive block
  const sendBlockHash = pendingBlocks.history[0].hash

  return await Nano.receive(
    sendBlockHash,
    process.env.RECIPIENT_WALLET_PRIVATE_KEY,
    process.env.RECIPIENT_WALLET
  )
}

receive()
