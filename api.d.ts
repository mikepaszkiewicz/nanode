export type API = {
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

  work_validate: {
    body: {
      work: string
      hash: string
    }
    response: {
      valid: string
    }
  }
}

export type GetBlock = {
  type: string
  account: string
  representative: string
  source: string
  work: string
  signature: string
}

export type HistoryBlock = {
  type: string
  account: string
  hash: string
  amount: string
}

export type SendBlock = {
  key: string
  account: string
  destination: string
  balance: string
  amount: string
  previous: string
  work: string
}

export type ReceiveBlock = {
  key: string
  account: string
  previous: string
  work: string
  source: string
}

export type OpenBlock = {
  key: string
  source: string
  previous?: string
  representative: string
  work: string
}

export type ChangeBlock = {
  previous: string
  key: string
  work: string
  representative: string
}

export type AccountInfo = {
  public: string
  private: string
  account: string
}
