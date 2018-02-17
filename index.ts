import axios from 'axios'
const {accountPair} = require('./util/util.js')

import {API, SendBlock, ReceiveBlock, OpenBlock, ChangeBlock} from './api'

export type RPCClient = (params: any) => Promise<any>
function createAPI<API extends {[action: string]: any} = any>(
  rpcClient: RPCClient
) {
  return async function callRPC<Action extends keyof API>(
    action: Action,
    body: API[Action]['body']
  ): Promise<API[Action]['response']> {
    const params = Object.assign({}, body, {action})
    return rpcClient(params)
  }
}

export function createAxiosClient(
  apiKey: string,
  baseURL = 'https://api.nanode.co/'
): RPCClient {
  const rpc = axios.create({
    baseURL,
    headers: {
      Authorization: apiKey
    }
  })

  return async function(params: any): Promise<any> {
    const {data} = await rpc.post('/', params)
    return data
  }
}

export interface NanoConstructorOptions {
  apiKey?: string
  url?: string
  rpcClient?: RPCClient
  debug?: boolean
}

export default class Nano {
  rpc = createAPI<API>(null)
  debug: boolean

  constructor(options: NanoConstructorOptions) {
    this.debug = !!options.debug
    if (options.rpcClient) {
      this.rpc = createAPI<API>(options.rpcClient)
    } else {
      const rpcClient = createAxiosClient(options.apiKey, options.url)
      this.rpc = createAPI<API>(rpcClient)
    }
  }

  log(message: string) {
    if (this.debug) {
      console.log(message)
    }
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
    private_key: string,
    representative?: string,
    send_block_hash?: string
  ) {
    const {log} = this

    if (!private_key) {
      throw new Error('Must pass private_key argument')
    }

    if (!representative) {
      representative =
        'xrb_1nanode8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzffeg'
    }

    const {publicKey} = accountPair(private_key)
    const {work} = await this.work.generate(publicKey)

    const block = await this.block.open({
      previous: publicKey,
      key: private_key,
      source: send_block_hash,
      work,
      representative
    })

    const result = await this.block.publish(block.block)
    log(`Opened NANO block ${result.hash} with rep. ${representative}!`)
    return result
  }

  //Top-level call: send block
  async send(
    private_key: string,
    amount: string,
    recipient_wallet_address: string
  ) {
    const {log} = this

    if (!private_key) {
      throw new Error('Must pass private_key argument')
    }

    const {balance, frontier, work} = await this.generateLatestWork(private_key)
    const rai_to_send = await this.convert.toRaw(+amount * 1000, 'krai')

    const block = await this.block.send({
      key: private_key,
      // account: address,
      destination: recipient_wallet_address,
      balance,
      amount: rai_to_send.amount,
      previous: frontier,
      work
    })

    const result = await this.block.publish(block.block)
    log(`Sent ${rai_to_send} NANO to ${recipient_wallet_address}!`)
    return result.hash
  }

  //Top-level call: receive block
  async receive(private_key: string, send_block_hash?: string) {
    const {log} = this

    if (!private_key) {
      throw new Error('Must pass private_key argument')
    }

    const {address, frontier, work} = await this.generateLatestWork(private_key)

    const block = await this.block.receive({
      key: private_key,
      previous: frontier,
      work,
      source: send_block_hash
    })

    const result = await this.block.publish(block.block)
    log(`Received block ${send_block_hash} to wallet ${address}!`)
    return result
  }

  //Top-level call: change block
  async change(private_key: string, representative: string) {
    const {log} = this

    if (!private_key) {
      throw new Error('Must pass private_key argument')
    }

    const {frontier, work} = await this.generateLatestWork(private_key)

    const block = await this.block.change({
      previous: frontier,
      representative,
      work,
      key: private_key
    })

    const result = await this.block.publish(block.block)
    log(`Opened NANO block ${result.hash} with rep. ${representative}!`)
    return result
  }

  async generateLatestWork(private_key: string) {
    const {address} = accountPair(private_key)
    const {balance, frontier} = await this.account.info(address)
    const {work} = await this.work.generate(frontier)

    return {
      address,
      balance,
      frontier,
      work
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
      async balance(account: string) {
        if (!account) {
          throw new Error(`Must supply account address argument`)
        }
        return rpc('account_balance', {account})
      },
      async balances(accounts: string[], count?: string) {
        return rpc('accounts_balances', {
          accounts
        })
      },
      async block_count(account: string) {
        if (!account) {
          throw new Error(`Must supply account address argument`)
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
        if (!account) {
          throw new Error(`Must supply account address argument`)
        }
        return rpc('account_history', {
          account,
          count: count || '1'
        }).then(res => res.data)
      },
      async info(account?: string) {
        if (!account) {
          throw new Error(`Must supply account address argument`)
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
        if (!account) {
          throw new Error(`Must supply account address argument`)
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
      async weight(account: string) {
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
