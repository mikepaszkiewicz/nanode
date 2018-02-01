import axios from 'axios'

interface APIDef {
  [action: string]: any
}

type API = {
  block_create: {
    body: {
      type: 'open' | 'send' | 'receive'
      key: string //open, send, receive: PRIVATE KEY for XRB wallet to 'sign' the block
      account?: string //open, send: The 'target' wallet which is being opened or debited
      representative?: string //open: A 'representative' wallet to use your balance as vote weight
      source?: string //open, receive: Always refers to the most recent block hash on YOUR account
      destination: string //send: destination xrb wallet
      balance: string //send: current balance of debited address
      amount: string
      previous: string
      work: string
    }
    response: {
      hash: string
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
  deterministic_key: {
    body: {
      seed: string
      index: string
    }
    response: any
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
  origin_address?: string
  origin_key?: string

  constructor(options: {
    api_key: string
    url: string
    origin_address?: string
    origin_key?: string
  }) {
    if (!options.api_key) {
      throw new Error('Must pass api_key to constructor')
    }
    if (!options.url) {
      throw new Error('Must past RPC URL to constructor')
    }
    this.rpc = createAPI<API>(options.url, options.api_key)
    this.origin_address = options.origin_address
    this.origin_key = options.origin_key
  }
  async get_deterministic_key(seed: string) {
    return this.rpc('deterministic_key', {seed, index: '0'})
  }
  get account() {
    const {rpc} = this
    return {
      async history(account: string) {
        return await rpc('account_history', {
          account,
          count: '1'
        })
      },
      async info(account: string) {
        return await rpc('account_info', {
          account
        })
      }
    }
  }
  get convert() {
    const {rpc} = this
    return {
      async krai_to_raw(amount: string | number) {
        return await rpc('krai_to_raw', {amount: amount})
      }
    }
  }
  get block() {
    const {rpc} = this

    return {
      async send(block: SendBlock) {
        return await rpc('block_create', {
          type: 'send',
          ...block
        })
          .then((res: any) => {
            console.log(res)
            return res
          })
          .catch((err: any) => {
            debugger
          })
      },
      async publish(block: string) {
        return await rpc('process', {
          block: block
        })
          .then((res: any) => {
            return res
          })
          .catch((err: any) => {
            debugger
          })
      }
    }
  }
  get work() {
    const {rpc} = this

    return {
      async generate(hash: string) {
        return rpc('work_generate', {hash})
      },
      async cancel(hash: string) {
        return rpc('work_cancel', {hash})
      },
      async get(wallet: string, account: string) {
        return rpc('work_get', {wallet, account})
      }
    }
  }
  async send(
    amount: string,
    receipient_wallet_address: string,
    origin_private_key?: string,
    origin_wallet_address?: string
  ) {
    try {
      const origin_wallet = this.origin_address || origin_wallet_address
      if (!origin_wallet) {
        throw new Error(
          'Must pass origin_wallet_address in either send or constructor'
        )
      }
      const private_key = this.origin_key || origin_private_key
      if (!private_key) {
        throw new Error(
          'Must pass origin_wallet_address in either send or constructor'
        )
      }

      const account = await this.account.info(origin_wallet)
      console.log('Step 1 (balance): ', account.balance)
      console.log('Step 1 (latest hash): ', account.frontier)

      const work = await this.work.generate(account.frontier)
      console.log('Step 2 (generated PoW): ', work.work)

      const rai_to_send = await this.convert.krai_to_raw(+amount * 1000)

      const newBlock = {
        key: private_key,
        account: origin_wallet,
        destination: receipient_wallet_address,
        balance: account.balance,
        amount: rai_to_send.amount,
        previous: account.frontier,
        work: work.work
      }

      const block = await this.block.send(newBlock)
      console.log('Step 3 (created block): ', block.hash)

      const result = await this.block.publish(block.block)
      console.log('Step 4 (Publish block to network): ', result)
      return result
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
