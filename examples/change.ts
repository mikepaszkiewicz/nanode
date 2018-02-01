import Nano from './init'
import open from './open'
export async function change() {
  try {
    const openedAccount = await open()

    //change block
    const result = await Nano.change(
      openedAccount.result.hash,
      process.env.SECONDARY_REP,
      openedAccount.target.private,
      openedAccount.target.public
    )
  } catch (err) {
    throw new Error(err.message)
  }
}

change()
