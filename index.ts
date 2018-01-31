require('dotenv').config()

import axios from 'axios'

interface APIDef {
  [action: string]: any
}

interface API {
  block_create: {
    body: {
      type: 'open' | 'send' | 'receive'

      //open, send, receive: PRIVATE KEY for XRB wallet to 'sign' the block
      key: string

      //open, send: The 'target' wallet which is being opened or debited
      account?: string

      //open: A 'representative' wallet to use your balance as vote weight
      representative?: string //Voting representative address

      //open, receive: Always refers to the most recent block hash on YOUR account
      source: string

      //send: destination xrb wallet
      destination: string

      //send: current balance of debited address
      balance: string

      amount: string
    }
    response: {
      hash: string
      block: string
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
}

type ProcessBlock = {
  account: string
  type: 'process'
  representative: string
  source: string
  work: string
  signature: string
}
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
  const api = axios.create({
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
    return (await api.post('/', request)).data
  }
}

export default class Nano {
  api: any
  origin_address?: string
  origin_key?: string

  constructor(options: {
    api_key: string
    url?: string
    origin_address?: string
    origin_key?: string
  }) {
    if (!options.api_key) {
      throw new Error('Must pass api_key to constructor')
    }
    this.api = createAPI<API>(
      options.url || `https://rpc.raiblocks.club`,
      options.api_key
    )
    this.origin_address = options.origin_address
    this.origin_key = options.origin_key
  }
  async get_deterministic_key(seed: string) {
    return this.api('deterministic_key', {seed, index: '0'})
  }
  get account() {
    const {api} = this
    return {
      async history(account: string) {
        return await api('account_history', {
          account,
          count: '1'
        })
      },
      async info(account: string) {
        return await api('account_info', {
          account
        })
      }
    }
  }
  get block() {
    const {api} = this

    return {
      async send(block: SendBlock) {
        return await api('block_create', {
          type: 'send',
          ...block
        })
      },
      async publish(block: ProcessBlock) {
        return await api('process', {...block})
      }
    }
  }
  get work() {
    const {api} = this

    return {
      async generate(hash: string) {
        return api('work_generate', {hash})
      }
    }
  }
  async send(
    rai_amount: string,
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

      const block = await this.block.send({
        key: private_key,
        account: origin_wallet,
        destination: receipient_wallet_address,
        balance: account.balance,
        amount: rai_amount,
        previous: account.frontier,
        work: work.work
      })
      console.log('Step 3 (created block): ', block.hash)

      const result = await this.block.publish(block.block)
      console.log('Step 4 (Publish block to network): ', result)
      return result
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
