import axios from 'axios'

interface APIDef {
  [action: string]: any
}

type API = {
  account_balance: {
    body: {
      account: string
    }
    response: {
      balance: string
      pending: string
    }
  }

  account_block_count: {
    body: {
      account: string
    }
    response: {
      block_count: string
    }
  }

  account_get: {
    body: {
      key: string
    }
    response: {
      account: string
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

  account_key: {
    body: {
      account: string
    }
    response: {
      key: string
    }
  }

  account_representative: {
    body: {
      account: string
    }
    response: {
      representative: string
    }
  }

  account_weight: {
    body: {
      account: string
    }
    response: {
      weight: string
    }
  }

  accounts_balances: {
    body: {
      accounts: string[]
    }
    response: {
      [account: string]: {
        balance: string
        pending: string
      }
    }
  }

  accounts_frontiers: {
    body: {
      accounts: string[]
    }
    response: {
      frontiers: {
        [account: string]: string
      }
    }
  }

  accounts_pending: {
    body: {
      accounts: string[]
      count?: string
    }
    response: {
      blocks: {
        [account: string]: string
      }
    }
  }

  available_supply: {
    body: {}
    response: {
      available: string
    }
  }

  block: {
    body: {
      hash: string
    }
    response: {
      contents: GetBlock
    }
  }

  blocks: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: {
        [account: string]: GetBlock
      }
    }
  }

  block_account: {
    body: {
      hash: string
    }
    response: {
      account: string
    }
  }

  block_count: {
    body: {}
    response: {
      count: string
      unchecked: string
    }
  }

  block_count_type: {
    body: {}
    response: {
      send: string
      receive: string
      open: string
      change: string
    }
  }

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

  blocks_info: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: {
        [account: string]: {
          contents: GetBlock
          block_account: string
          amount: string
        }
      }
    }
  }

  chain: {
    body: {
      block: string
      count: string
    }
  }

  delegators: {
    body: {
      account: string
    }
    response: {
      delegators: {
        [account: string]: string
      }
    }
  }

  delegators_count: {
    body: {
      account: string
    }
    response: {
      count: string
    }
  }

  deterministic_key: {
    body: {
      seed: string
      index: string
    }
    response: any
  }

  frontiers: {
    body: {
      account: string
    }
    response: {
      frontiers: {
        [account: string]: string
      }
    }
  }

  frontier_count: {
    body: {
      account: string
    }
    response: {
      count: string
    }
  }

  key_create: {
    body: any
    response: AccountInfo
  }

  key_expand: {
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

  history: {
    body: {
      hash: string
      count: string
    }
    response: HistoryBlock[]
  }

  ledger: {
    body: {
      account: string
      count?: string
      representative?: string
      weight?: string
      pending?: string
    }
    response: {
      accounts: {
        [account: string]: {
          frontier: string
          open_block: string
          representative_block: string
          balance: string
          modified_timestamp: string
          block_count: string
          representative?: string
          weight?: string
          pending?: string
        }
      }
    }
  }

  pending: {
    body: {
      account: string
      count: string
    }
    response: {
      blocks: string[]
    }
  }

  pending_exists: {
    body: {
      hash: string
    }
    response: {
      exists: '1' | '0'
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

  receive_minimum: {
    body: {}
    response: {
      amount: string
    }
  }

  receive_minimum_set: {
    body: {
      amount: string
    }
    response: {
      success: string
    }
  }

  representatives: {
    body: {}
    response: {
      representatives: {
        [account: string]: string
      }
    }
  }

  successors: {
    body: {
      block: string
      count: string
    }
    response: {
      blocks: string[]
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

// namespace Block {
//   export interface Get {
//     type: string
//     account: string
//     representative: string
//     source: string
//     work: string
//     signature: string
//   }
// }

type GetBlock = {
  type: string
  account: string
  representative: string
  source: string
  work: string
  signature: string
}

type HistoryBlock = {
  type: string
  account: string
  hash: string
  amount: string
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
  work: string
}

type ChangeBlock = {
  previous: string
  key: string
  work: string
  representative: string
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
    //can't pass this.debug??
    if (true) {
      console.log(message)
    }
  }
  async call(action: string, body: any) {
    return this.rpc(action as any, body)
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
  async available() {
    return this.rpc('available_supply', {})
      .then(res => res.available)
      .catch(err => {
        throw new Error(`available failed: ${err.message}`)
      })
  }
  get minimumReceive() {
    const {rpc} = this
    return {
      async get() {
        return await rpc('receive_minimum', {})
          .then(res => res.amount)
          .catch(err => {
            throw new Error(`available failed: ${err.message}`)
          })
      },
      async set(amount: string) {
        return await rpc('receive_minimum_set', {amount})
          .then(res => res.success === '')
          .catch(err => {
            throw new Error(`available failed: ${err.message}`)
          })
      }
    }
  }
  get account() {
    const {rpc, log} = this
    return {
      async get(key: string) {
        if (!key) {
          throw new Error(
            `Must pass key to constructor, or account name to this method`
          )
        }
        return await rpc('account_get', {key})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.get failed: ${err.message}`)
          })
      },
      async balance(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return await rpc('account_balance', {account})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.balance failed: ${err.message}`)
          })
      },
      async balances(accounts: string[], count?: string) {
        return await rpc('accounts_balances', {accounts})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.balances failed: ${err.message}`)
          })
      },
      async block_count(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return await rpc('account_block_count', {account})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.block_count failed: ${err.message}`)
          })
      },
      async frontiers(accounts: string[], count?: string) {
        return await rpc('accounts_frontiers', {accounts})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.frontiers failed: ${err.message}`)
          })
      },
      async history(account?: string, count?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
        return await rpc('account_history', {account, count: count || '1'})
          .then(res => res.data)
          .catch(err => {
            throw new Error(`account.pending failed: ${err.message}`)
          })
      },
      async info(account?: string) {
        account = this.origin_address || account
        if (!account) {
          throw new Error(
            `Must pass origin_address to constructor, or account name to this method`
          )
        }
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
      async key(account: string) {
        return await rpc('account_key', {account})
          .then(res => res)
          .catch(err => {
            throw new Error(`account.key failed: ${err.message}`)
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
          ? await rpc('accounts_pending', {
              accounts: accountOrAccounts as string[],
              threshold,
              count: count.toString() || '1'
            })
              .then(res => res)
              .catch(err => {
                throw new Error(
                  `account.accounts_pending failed: ${err.message}`
                )
              })
          : await rpc('pending', {
              account: accountOrAccounts as string,
              threshold,
              count: count.toString() || '1'
            })
              .then(res => res)
              .catch(err => {
                throw new Error(`account.pending failed: ${err.message}`)
              })
      },
      async representative(account: string) {
        return await rpc('account_representative', {account})
          .then(res => res.representative)
          .catch(err => {
            throw new Error(`account.representative failed: ${err.message}`)
          })
      },
      async wieght(account: string) {
        return await rpc('account_weight', {account})
          .then(res => res.weight)
          .catch(err => {
            throw new Error(`account.weight failed: ${err.message}`)
          })
      }
    }
  }

  get block() {
    const {rpc, log} = this

    return {
      async account(hash: string) {
        return await rpc('block_account', {hash})
          .then(res => {
            return res.account
          })
          .catch((err: Error) => {
            throw new Error(`block.account failed: ${err.message}`)
          })
      },
      async count(by_type?: string) {
        return by_type
          ? await rpc('block_count_type', {})
              .then(res => res)
              .catch((err: Error) => {
                throw new Error(`block.count_type failed: ${err.message}`)
              })
          : await rpc('block_count', {})
              .then(res => res)
              .catch((err: Error) => {
                throw new Error(`block.count failed: ${err.message}`)
              })
      },
      async chain(block: string, count?: string) {
        return await rpc('chain', {block, count: count || '1'})
          .then(res => res.blocks)
          .catch((err: Error) => {
            throw new Error(`block.chain failed: ${err.message}`)
          })
      },
      async change(block: ChangeBlock) {
        return await rpc('block_create', {type: 'change', ...block})
          .then(res => {
            log(`(BLOCK) Changing ${block.key}`)
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.change failed: ${err.message}`)
          })
      },
      async history(hash: string, count?: string) {
        return await rpc('history', {hash, count: count || '0'})
          .then(res => res)
          .catch((err: Error) => {
            throw new Error(`block.change failed: ${err.message}`)
          })
      },
      async open(block: OpenBlock) {
        return await rpc('block_create', {type: 'open', ...block})
          .then(res => {
            log(`(BLOCK) Opening ${block.key}`)
            return res
          })
          .catch((err: Error) => {
            throw new Error(`block.open failed: ${err.message}`)
          })
      },
      async pending(hash: string) {
        return await rpc('pending_exists', {hash})
          .then(res => res.exists === '1')
          .catch((err: Error) => {
            throw new Error(`block.change failed: ${err.message}`)
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
      }
    }
  }
  get blocks() {
    const {rpc} = this
    return {
      async find(hashOrHashes: string | string[], details: boolean) {
        const getMulti = (typeof hashOrHashes as string | string[]) === 'array'
        if (getMulti) {
          return details
            ? await rpc('blocks_info', {hashes: hashOrHashes as string[]})
                .then(res => res.blocks)
                .catch((err: Error) => {
                  throw new Error(`blocks.get failed: ${err.message}`)
                })
            : await rpc('blocks', {hashes: hashOrHashes as string[]})
                .then(res => res.blocks)
                .catch((err: Error) => {
                  throw new Error(`blocks.get failed: ${err.message}`)
                })
        } else {
          return await rpc('block', {hash: hashOrHashes as string})
            .then(res => res.contents)
            .catch((err: Error) => {
              throw new Error(`block.get failed: ${err.message}`)
            })
        }
      }
    }
  }
  get delegators() {
    const {rpc} = this
    return {
      async get(account: string) {
        return await rpc('delegators', {account})
          .then(res => res)
          .catch((err: Error) => {
            throw new Error(`delegators.get failed: ${err.message}`)
          })
      },
      async count(account: string) {
        return await rpc('delegators_count', {account})
          .then(res => res.count)
          .catch((err: Error) => {
            throw new Error(`delegators.count failed: ${err.message}`)
          })
      }
    }
  }
  get frontiers() {
    const {rpc} = this
    return {
      async get(account: string, count?: string) {
        return await rpc('frontiers', {account, count: count || '1'})
          .then(res => res)
          .catch((err: Error) => {
            throw new Error(`frontiers.get failed: ${err.message}`)
          })
      },
      async count(account: string) {
        return await rpc('frontier_count', {account})
          .then(res => res.count)
          .catch((err: Error) => {
            throw new Error(`frontiers.count failed: ${err.message}`)
          })
      }
    }
  }
  async representatives() {
    const {rpc} = this
    return await rpc('representatives', {})
      .then(res => res.representatives)
      .catch((err: Error) => {
        throw new Error(`representatives failed: ${err.message}`)
      })
  }
  async successors(block: string, count?: number) {
    const {rpc} = this
    return await rpc('successors', {
      block,
      count: count ? count.toString() : '1'
    })
      .then(res => res.blocks)
      .catch((err: Error) => {
        throw new Error(`representatives failed: ${err.message}`)
      })
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
      },
      async expand(key: string) {
        return await rpc('key_expand', {})
          .then(res => res)
          .catch(err => {
            throw new Error(`key.expand failed: ${err.message}`)
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
    recipient_wallet_address: string, //or are sending on behalf of someone else (weird use case) //if we aren't sending from account passed in on init
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

      const rai_to_send = await this.convert.toRaw(+amount * 1000, 'krai')

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
    send_block_hash: string,
    recipient_private_key?: string,
    recipient_wallet_address?: string
  ) {
    //if we aren't receiving to account passed in on init...
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
  async ledger(
    account: string,
    count?: number,
    representative?: boolean,
    weight?: boolean,
    pending?: boolean
  ) {
    const {rpc} = this
    account = this.origin_address || account
    if (!account) {
      throw new Error(
        `Must pass origin_address to constructor, or account name to this method`
      )
    }
    return await rpc('ledger', {
      account,
      count: count.toString() || '1',
      representative: (!!representative).toString(),
      weight: (!!weight).toString(),
      pending: (!!pending).toString()
    })
      .then(res => res)
      .catch(err => {
        throw new Error(`ledger failed: ${err.message}`)
      })
  }
  get convert() {
    const {rpc} = this
    return {
      async toRaw(amount: number, denomination: 'krai' | 'mrai' | 'rai') {
        if (!amount) {
          throw new Error('Must pass amount to conversion call')
        }
        return await rpc(`${denomination}_to_raw` as any, {
          amount: amount.toString()
        })
          .then(res => res)
          .catch(err => {
            throw new Error(
              `convert.${denomination}_to_rai failed: ${err.message}`
            )
          })
      },
      async fromRaw(amount: number, denomination: 'krai' | 'mrai' | 'rai') {
        if (!amount) {
          throw new Error('Must pass amount to conversion call')
        }
        return await rpc(`${denomination}_from_raw` as any, {
          amount: amount.toString()
        })
          .then(res => res)
          .catch(err => {
            throw new Error(
              `convert.${denomination}_from_raw failed: ${err.message}`
            )
          })
      }
    }
  }
  async change(
    previous: string,
    representative: string,
    target_private_key?: string,
    target_public_key?: string
  ) {
    const {log} = this

    try {
      const work = await this.work.generate(previous)

      const block = await this.block.change({
        previous,
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
}
