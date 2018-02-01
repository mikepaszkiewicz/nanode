import axios from 'axios'

interface APIDef {
  [action: string]: any
}

type API = {
  block_create: {
    body: {
      type: 'open' | 'send' | 'receive' | 'change'
      key: string //open, send, receive: PRIVATE KEY for XRB wallet to 'sign' the block
      previous?: string
      work: string
      account?: string //open, send: The 'target' wallet which is being opened or debited
      representative?: string //open: A 'representative' wallet to use your balance as vote weight
      source?: string //open, receive: Always refers to the most recent block hash on YOUR account
      signature?: string
      destination?: string //send: destination xrb wallet
      balance?: string //send: current balance of debited address
      amount?: string
    }
    response: {
      hash: string
      block: string
    }
  }
  receive: {
    body: {
      wallet: string
      account: string
      block: string
    }
    response: {
      block: string
    }
  }
  process: {
    body: {
      block: string
    }
    response: {
      hash: string
    }
  }
  account_history: {
    body: {
      account: string //target wallet
      count?: string //return limit
    }
    response: any
  }
  account_info: {
    body: {
      account: string //target wallet
    }
    response: {
      frontier: string
      open_block: string
      representative_block: string
      balance: string
      modified_timestamp: string
      block_count: string
    }
  }
  accounts_pending: {
    body: {
      accounts: string[]
      count?: string
    }
  }
  deterministic_key: {
    body: {
      seed: string
      index: string
    }
    response: any
  }
  key_create: {
    body: any
    response: AccountInfo
  }
  krai_to_raw: {
    body: {
      amount: string | number
    }
    response: {
      amount: string
    }
  }
  work_generate: {
    body: {
      hash: string
    }
    response: {
      work: string
    }
  }
  work_cancel: {
    body: {
      hash: string
    }
    response: {}
  }
  work_get: {
    body: {
      wallet: string
      account: string
    }
    response: {
      work: string
    }
  }
}

// type ProcessBlock = {
//   account: string
//   type: 'process'
//   representative: string
//   source: string
//   work: string
//   signature: string
// }
type SendBlock = {
  key: string
  account: string
  destination: string
  balance: string
  amount: string
  previous: string
  work: string
}

type ReceiveBlock = {
  key: string
  account: string
  previous: string
  work: string
  source: string
}

type OpenBlock = {
  key: string
  source: string
  previous?: string
  representative: string
  work?: string
}

type AccountInfo = {
  public: string
  private: string
  account: string
}
function createAPI<API extends APIDef = any>(baseURL: string, apiKey: string) {
  const rpc = axios.create({
    baseURL,
    headers: {
      Authorization: apiKey
    }
  })
  return async function callRPC<Action extends keyof API>(
    action: Action,
    body: API[Action]['body']
  ): Promise<API[Action]['response']> {
    const request = Object.assign({}, body, {action})

    try {
      const result = await rpc.post('/', request)
      if (result && result.data) {
        return result.data
      }

      throw new Error(result.statusText)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default class Nano {
  rpc = createAPI<API>(null, null)
  debug: boolean
  origin_address?: string
  origin_key?: string

  constructor(options: {
    api_key: string
    url: string
    origin_address?: string
    origin_key?: string
    debug?: boolean
  }) {
    if (!options.api_key) {
      throw new Error('Must pass api_key to constructor')
    }
    if (!options.url) {
      throw new Error('Must past RPC URL to constructor')
    }
    this.debug = !!options.debug
    this.rpc = createAPI<API>(options.url, options.api_key)
    this.origin_address = options.origin_address
    this.origin_key = options.origin_key
  }
  log(message: string) {
    //can't pass this.debug
    if (true) {
      console.log(message)
    }
  }
  async get_deterministic_key(seed: string) {
    return this.rpc('deterministic_key', {
      seed,
      index: '0'
    })
      .then(res => res)
      .catch(err => {
        throw new Error(`get_dertiministic_key failed: ${err.message}`)
      })
  }
  get account() {
    const {rpc, log} = this
    return {
      async history(account: string, count?: string) {
        return await rpc('account_history', {
          account,
          count: count || '1'
        })
          .then(res => res)
          .catch(err => {
            throw new Error(`account.pending failed: ${err.message}`)
          })
      },
      async info(account: string) {
        return await rpc('account_info', {account})
          .then(account => {
            log(`(ACCOUNT) balance: ${account.balance}`)
            log(`(ACCOUNT) latest hash: ${account.frontier}`)
            return account
          })
          .catch(err => {
            throw new Error(`account.info failed: ${err.message}`)
          })
      },
      async pending(accounts: string[], count?: string) {
        return await rpc('accounts_pending', {
          accounts,
          count: count || '1'
        })
          .then(res => res)
          .catch(err => {
            throw new Error(`account.pending failed: ${err.message}`)
          })
      }
    }
  }
  get convert() {
    const {rpc, log} = this
    return {
      async krai_to_raw(amount: string | number) {
        if (!amount) {
          throw new Error('Must pass amount to conversion call')
        }
        return await rpc('krai_to_raw', {amount: amount.toString()})
          .then(res => {
            log(`(CONVERT) ${amount} krai to ${res.amount} raw`)
            return res
          })
          .catch(err => {
            throw new Error(`convert.krai_to_rai failed: ${err.message}`)
          })
      }
    }
  }
  get block() {
    const {rpc, log} = this

    return {
      async open(block: OpenBlock) {
        debugger
        return await rpc('block_create', {type: 'open', ...block})
          .then(res => {
            log(`(BLOCK) Opening ${block.key}`)
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.open failed: ${err.message}`)
          })
      },
      async send(block: SendBlock) {
        return await rpc('block_create', {type: 'send', ...block})
          .then(res => {
            log(
              `(BLOCK) Sending ${block.amount} from ${block.account} to ${
                block.destination
              }`
            )
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.send failed: ${err.message}`)
          })
      },
      async publish(block: string) {
        return await rpc('process', {block: block})
          .then(res => {
            log(`(BLOCK) Published: ${res.hash}`)
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.publish failed: ${err.message}`)
          })
      },
      async receive(block: ReceiveBlock) {
        return await rpc('block_create', {type: 'receive', ...block})
          .then(res => {
            log(`Received block ${block.source}`)
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.receive failed: ${err.message}`)
          })
      }
    }
  }
  get key() {
    const {rpc, log} = this
    return {
      async create() {
        return await rpc('key_create', {})
          .then(res => {
            log(`Created key ${res}`)
            return res
          })
          .catch(err => {
            throw new Error(`key.create failed: ${err.message}`)
          })
      }
    }
  }
  get work() {
    const {rpc, log} = this

    return {
      async generate(hash: string) {
        return await rpc('work_generate', {hash})
          .then(result => {
            log(`(WORK) generated PoW: ${result.work}`)
            return result
          })
          .catch(err => {
            throw new Error(`work.generate failed: ${err.message}`)
          })
      },
      async cancel(hash: string) {
        return await rpc('work_cancel', {hash})
          .then(result => {
            log(`(WORK) cancelled PoW for ${hash}`)
            return result
          })
          .catch(err => {
            throw new Error(`work.cancel failed: ${err.message}`)
          })
      },
      async get(wallet: string, account: string) {
        return await rpc('work_get', {
          wallet,
          account
        })
          .then(result => {
            log(`(WORK) retrieved PoW: ${result.work}`)
            return result
          })
          .catch(err => {
            throw new Error(`work.get failed: ${err.message}`)
          })
      }
    }
  }
  async send(
    amount: string,
    recipient_wallet_address: string, //if we aren't sending from account passed in on init
    //or are sending on behalf of someone else (weird use case)
    origin_private_key?: string,
    origin_account_address?: string
  ) {
    const {log} = this
    try {
      const origin_wallet = this.origin_address || origin_account_address
      if (!origin_wallet) {
        throw new Error(
          'Must pass origin_account_address in either send or constructor'
        )
      }
      const private_key = this.origin_key || origin_private_key
      if (!private_key) {
        throw new Error(
          'Must pass origin_account_address in either send or constructor'
        )
      }

      const account = await this.account.info(origin_wallet)

      const work = await this.work.generate(account.frontier)

      const rai_to_send = await this.convert.krai_to_raw(+amount * 1000)

      const block = await this.block.send({
        key: private_key,
        account: origin_wallet,
        destination: recipient_wallet_address,
        balance: account.balance,
        amount: rai_to_send.amount,
        previous: account.frontier,
        work: work.work
      })

      const result = await this.block.publish(block.block)
      log(`Sent ${account.balance} NANO to ${recipient_wallet_address}!`)
      return result
    } catch (err) {
      throw new Error(`Nano.send failed: ${err.message}`)
    }
  }
  async receive(
    send_block_hash: string, //if we aren't receiving to account passed in on init...
    recipient_private_key?: string,
    recipient_wallet_address?: string
  ) {
    const {log} = this
    try {
      const receiving_wallet = this.origin_address || recipient_wallet_address
      if (!receiving_wallet) {
        throw new Error(
          'Must pass recipient_wallet_address in either receive call or constructor'
        )
      }
      const private_key = this.origin_key || recipient_private_key
      if (!private_key) {
        throw new Error(
          'Must pass origin_key in either receive call or constructor'
        )
      }

      const account = await this.account.info(receiving_wallet)

      const work = await this.work.generate(account.frontier)

      const block = await this.block.receive({
        key: private_key,
        account: receiving_wallet,
        previous: account.frontier,
        work: work.work,
        source: send_block_hash
      })
      const result = await this.block.publish(block.block)
      log(
        `Received ${
          account.balance
        } NANO block ${send_block_hash} to wallet ${receiving_wallet}!`
      )
      return result
    } catch (err) {
      throw new Error(`Nano.send failed: ${err.message}`)
    }
  }
  async open(
    send_block_hash: string,
    representative: string,
    target_private_key?: string,
    target_public_key?: string
  ) {
    const {log} = this

    const private_key = this.origin_key || target_private_key
    if (!private_key) {
      throw new Error('Must pass origin_key in either open call or constructor')
    }

    try {
      const work = await this.work.generate(target_public_key)

      const block = await this.block.open({
        previous: target_public_key,
        key: target_private_key,
        source: send_block_hash,
        work: work.work,
        representative
      })

      const result = await this.block.publish(block.block)
      log(`Opened NANO block ${result.hash} with rep. ${representative}!`)
      return result
    } catch (err) {
      throw new Error(`open failed: ${err.message}`)
    }
  }
}
