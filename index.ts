import axios from 'axios'
const {accountPair} = require('./util/util.js')

import {API, SendBlock, ReceiveBlock, OpenBlock, ChangeBlock} from './api'

function createAPI<
  API extends {
    [action: string]: any
  } = any
>(baseURL: string, apiKey: string) {
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

  constructor(options: {api_key: string; url: string; debug?: boolean}) {
    if (!options.api_key) {
      throw new Error('Must pass api_key to constructor')
    }
    if (!options.url) {
      throw new Error('Must past RPC URL to constructor')
    }
    this.debug = !!options.debug
    this.rpc = createAPI<API>(options.url, options.api_key)
  }
  log(message: string) {
    if (this.debug) {
      console.log(message)
    }
  }

  async call(action: string, body: any) {
    return this.rpc(action as any, body)
  }

  withAccount(private_key: string) {
    return {
      open: (respresentative?: string, hash?: string) => {
        return this.open(private_key, respresentative, hash)
      },
      receive: (hash?: string) => {
        return this.receive(private_key, hash)
      },
      send: (amount: string, address: string) => {
        return this.send(private_key, amount, address)
      },
      change: (representative: string) => {
        return this.change(private_key, representative)
      }
    }
  }

  //Top-level call: open block
  async open(
    target_private_key: string,
    representative?: string,
    send_block_hash?: string
  ) {
    const {log} = this

    if (!target_private_key) {
      throw new Error('Must pass target_private_key in arguments')
    }

    try {
      const {publicKey} = accountPair(target_private_key)
      const work = await this.work.generate(publicKey)

      const block = await this.block.open({
        previous: publicKey,
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

  //Top-level call: send block
  async send(
    origin_private_key: string,
    amount: string,
    recipient_wallet_address: string
  ) {
    const {log} = this
    try {
      if (!origin_private_key) {
        throw new Error('Must pass origin_private_key argument')
      }

      const address = accountPair(origin_private_key).address

      const account = await this.account.info(address)

      const work = await this.work.generate(account.frontier)

      const rai_to_send = await this.convert.toRaw(+amount * 1000, 'krai')

      const block = await this.block.send({
        key: origin_private_key,
        account: address,
        destination: recipient_wallet_address,
        balance: account.balance,
        amount: rai_to_send.amount,
        previous: account.frontier,
        work: work.work
      })

      const result = await this.block.publish(block.block)
      log(`Sent ${account.balance} NANO to ${recipient_wallet_address}!`)
      return result.hash
    } catch (err) {
      throw new Error(`Nano.send failed: ${err.message}`)
    }
  }

  //Top-level call: receive block
  async receive(recipient_private_key: string, send_block_hash?: string) {
    //if we aren't receiving to account passed in on init...
    const {log} = this
    try {
      if (!recipient_private_key) {
        throw new Error('Must pass recipient_private_key argument')
      }

      const receiving_wallet = accountPair(recipient_private_key).address

      const account = await this.account.info(receiving_wallet)

      const work = await this.work.generate(account.frontier)

      const block = await this.block.receive({
        key: recipient_private_key,
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

  //Top-level call: change block
  async change(target_private_key: string, representative: string) {
    const {log} = this

    try {
      const address = accountPair(target_private_key).address

      const account = await this.account.info(address)

      const work = await this.work.generate(account.frontier)

      const block = await this.block.change({
        previous: account.frontier,
        representative,
        work: work.work,
        key: target_private_key
      })

      const result = await this.block.publish(block.block)
      log(`Opened NANO block ${result.hash} with rep. ${representative}!`)
      return result
    } catch (err) {
      throw new Error(`open failed: ${err.message}`)
    }
  }

  //General account methods
  get account() {
    const {rpc, log} = this
    return {
      async get(key: string) {
        if (!key) {
          throw new Error(
            `Must pass key to constructor, or account name to this method`
          )
        }
        return rpc('account_get', {key})
      },
      async balance(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return rpc('account_balance', {account})
      },
      async balances(accounts: string[], count?: string) {
        return rpc('accounts_balances', {
          accounts
        })
      },
      async block_count(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return rpc('account_block_count', {
          account
        })
      },
      async frontiers(accounts: string[], count?: string) {
        return rpc('accounts_frontiers', {
          accounts
        })
      },
      async history(account?: string, count?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return rpc('account_history', {
          account,
          count: count || '1'
        }).then(res => res.data)
      },
      async info(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return rpc('account_info', {account}).then(account => {
          log(`(ACCOUNT) balance: ${account.balance}`)
          log(`(ACCOUNT) latest hash: ${account.frontier}`)
          return account
        })
      },
      async key(account: string) {
        return rpc('account_key', {account})
      },
      async ledger(
        account: string,
        count?: number,
        representative?: boolean,
        weight?: boolean,
        pending?: boolean
      ) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return rpc('ledger', {
          account,
          count: count.toString() || '1',
          representative: (!!representative).toString(),
          weight: (!!weight).toString(),
          pending: (!!pending).toString()
        })
      },
      async pending(
        accountOrAccounts: string | string[],
        count?: number,
        threshold?: string
      ) {
        const getMulti =
          (typeof accountOrAccounts as string | string[]) === 'array'
        return getMulti
          ? rpc('accounts_pending', {
              accounts: accountOrAccounts as string[],
              threshold,
              count: count.toString() || '1'
            })
          : rpc('pending', {
              account: accountOrAccounts as string,
              threshold,
              count: count.toString() || '1'
            })
      },
      async representative(account: string) {
        return rpc('account_representative', {
          account
        }).then(res => res.representative)
      },
      async wieght(account: string) {
        return rpc('account_weight', {account}).then(res => res.weight)
      }
    }
  }

  //General block related calls
  get block() {
    const {rpc, log} = this

    return {
      async account(hash: string) {
        return rpc('block_account', {hash}).then(res => {
          return res.account
        })
      },
      async count(by_type?: string) {
        return by_type ? rpc('block_count_type', {}) : rpc('block_count', {})
      },
      async chain(block: string, count?: string) {
        return rpc('chain', {
          block,
          count: count || '1'
        }).then(res => res.blocks)
      },
      async change(block: ChangeBlock) {
        return rpc('block_create', {
          type: 'change',
          ...block
        }).then(res => {
          log(`(BLOCK) Changing ${block.key}`)
          return res
        })
      },
      async history(hash: string, count?: string) {
        return rpc('history', {
          hash,
          count: count || '0'
        })
      },
      async open(block: OpenBlock) {
        return rpc('block_create', {
          type: 'open',
          ...block
        }).then(res => {
          log(`(BLOCK) Opening ${block.key}`)
          return res
        })
      },
      async pending(hash: string) {
        return rpc('pending_exists', {hash}).then(res => res.exists === '1')
      },
      async publish(block: string) {
        return rpc('process', {block: block}).then(res => {
          log(`(BLOCK) Published: ${res.hash}`)
          return res
        })
      },
      async receive(block: ReceiveBlock) {
        return rpc('block_create', {
          type: 'receive',
          ...block
        }).then(res => {
          log(`Received block ${block.source}`)
          return res
        })
      },
      async send(block: SendBlock) {
        return rpc('block_create', {
          type: 'send',
          ...block
        }).then(res => {
          log(
            `(BLOCK) Sending ${block.amount} from ${block.account} to ${
              block.destination
            }`
          )
          return res
        })
      }
    }
  }

  //Get one or many block's information
  async blocks(hashOrHashes: string | string[], details: boolean) {
    const {rpc} = this
    const getMulti = (typeof hashOrHashes as string | string[]) === 'array'
    if (getMulti) {
      return details
        ? rpc('blocks_info', {
            hashes: hashOrHashes as string[]
          }).then(res => res.blocks)
        : rpc('blocks', {
            hashes: hashOrHashes as string[]
          }).then(res => res.blocks)
    } else {
      return rpc('block', {
        hash: hashOrHashes as string
      }).then(res => res.contents)
    }
  }

  //Convert KRAI, MRAI, RAI to and from RAW
  get convert() {
    const {rpc} = this
    return {
      async toRaw(amount: number, denomination: 'krai' | 'mrai' | 'rai') {
        if (!amount) {
          throw new Error('Must pass amount to conversion call')
        }
        return rpc(`${denomination}_to_raw` as any, {
          amount: amount.toString()
        })
      },
      async fromRaw(amount: number, denomination: 'krai' | 'mrai' | 'rai') {
        if (!amount) {
          throw new Error('Must pass amount to conversion call')
        }
        return rpc(`${denomination}_from_raw` as any, {
          amount: amount.toString()
        })
      }
    }
  }

  //get, count delegators
  //TODO: could be a single method
  get delegators() {
    const {rpc} = this
    return {
      async get(account: string) {
        return rpc('delegators', {account}).then(res => res)
      },
      async count(account: string) {
        return rpc('delegators_count', {account}).then(res => res.count)
      }
    }
  }

  //Get, count frontiers
  //TODO: could be a single method
  get frontiers() {
    const {rpc} = this
    return {
      async get(account: string, count?: string) {
        return rpc('frontiers', {
          account,
          count: count || '1'
        })
      },
      async count(account: string) {
        return rpc('frontier_count', {account}).then(res => res.count)
      }
    }
  }

  //Create and expand keys
  get key() {
    const {rpc, log} = this
    return {
      async create() {
        return rpc('key_create', {}).then(res => {
          log(`Created key ${res}`)
          return res
        })
      },
      async expand(key: string) {
        return rpc('key_expand', {key})
      }
    }
  }

  //Generate and get work
  get work() {
    const {rpc, log} = this

    return {
      async generate(hash: string) {
        return rpc('work_generate', {hash}).then(result => {
          log(`(WORK) generated PoW: ${result.work}`)
          return result
        })
      },
      async validate(work: string, hash: string) {
        return rpc('work_validate', {work, hash})
      }
    }
  }

  async available() {
    return this.rpc('available_supply', {}).then(res => res.available)
  }
  async representatives() {
    return this.rpc('representatives', {}).then(res => res.representatives)
  }

  async get_deterministic_key(seed: string) {
    return this.rpc('deterministic_key', {
      seed,
      index: '0'
    })
  }

  get minimumReceive() {
    const {rpc} = this
    return {
      async get() {
        return rpc('receive_minimum', {})
      },
      async set(amount: string) {
        return rpc('receive_minimum_set', {
          amount
        }).then(res => res.success === '')
      }
    }
  }

  async successors(block: string, count?: number) {
    return this.rpc('successors', {
      block,
      count: count ? count.toString() : '1'
    })
  }
}
