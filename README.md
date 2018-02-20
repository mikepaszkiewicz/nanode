# Nano Client

Dead simple, promise-based client for interacting and building services on top of the NANO network, a next-generation cryptocurrency created by Colin LeMahieu with nearly instant transactions and no fees. [Learn more on the official repo](https://nanode.co/node-api) ⚡️

If you've worked with NANO before, you probably have experienced it's learning curve. The community is amazingly helpful and growing fast,
but the documentation and guides to working with it currently leave a lot to be desired.

**This library is designed to get anyone, even a total beginner, up and running building services on NANO in just a few minutes.** At it's core,
this package is a wrapper around the official [RPC protocol](https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol) that does a few things:

1. abstracts away some of the idiosyncracies and quirks with the RPC API,
2. exposes some top-level methods like `Nano.send()` and `Nano.recieve()`, so you don't have to know about creating, signing, publishing, etc.

Want to build with NANO, but not running a full node? [Sign up for node access and get your API key at nanode.co](https://nanode.co/node-api)

## Install

`npm install nanode`

## Getting Started

This library is built with TypeScript, and I highly reccommend you take advantage of your code editor's Intellisense features.

Note: Due to the use of 128-bit integers, all numeric amounts must be provided as strings, and will be returned as strings.

### Nanode Node API

```typescript
import Nano from 'nanode'
const nano = new Nano({api_key: process.env.NANODE_API_KEY})
```

### Your own Nano RPC server

```typescript
import Nano from 'nanode'
const nano = new Nano({url: 'http://localhost:7076'})
```

## Working with accounts

You can easily send, receive, get history and more by providing an account's private key:

```typescript
nano.account(PRIVATE_KEY)
```

### Generate an account

It's easy to generate a new random account. You'll get the account's private and public keys along with its address (`account` variable).

```typescript
const {private, public, account} = await nano.key.create()
```

### Open account

In order to open an account and let the network know it exists, we'll need publish an `open` block. An account can't be opened with zero balance, so we'll first need to send some Nano to our account's address from our own wallet or [NanoFaucet](https://www.nanofaucet.org/), then call `open()`.

```typescript
await nano.account(PRIVATE_KEY).open()
```

### Send funds

```typescript
await nano.account(PRIVATE_KEY).send('0.01', RECIPIENT_ADDRESS)
```

### Receive funds

The `receive()` method will automatically receive the latest pending block for the given account.

```typescript
await nano.account(PRIVATE_KEY).receive()
```

## Full list of methods

All methods return native or Bluebird promises and are fully compatible with `async/await`.

### Working with a specific account

If you're just looking to transact with Nano, these methods will cover 90% of your use case.

`const account = nano.account(PRIVATE_KEY)`

* `account.open(representative?: string, hash?: string)`
* `account.send(amount: string, address: string)`
* `account.receive(hash?: string)`
* `account.change(representative: string)`
* `account.balance()`
* `account.blockCount()`
* `account.history(count?: number)`
* `account.info()`
* `account.publicKey()`
* `account.ledger(count?: number, details?: boolean)`
* `account.pending(count?: number, threshold?: string)`
* `account.representative()`
* `account.weight()`

### Keys

Used for generating accounts and extrapolating public keys/addresses from private keys.

* `nano.key.create()`
* `nano.key.expand(privateKey: string)`

### Accounts

Account methods take a single account string or in some cases, an array of accounts.

* `nano.accounts.get(publicKey: string)`
* `nano.accounts.balance(account: string)`
* `nano.accounts.balances(accounts: string[])`
* `nano.accounts.block_count(account: string)`
* `nano.accounts.frontiers(accounts: string[])`
* `nano.accounts.history(account: string, count?: number)`
* `nano.accounts.info(account: string)`
* `nano.accounts.key(account: string)`
* `nano.accounts.ledger(account: string, count?: number, details?: boolean)`
* `nano.accounts.pending(account: string, count?: number, threshold?: string)`
* `nano.accounts.pendingMulti(accounts: string[], count?: number, threshold?: string)`
* `nano.accounts.representative(account: string)`
* `nano.accounts.weight(account: string)`

### Blocks

Has methods to get information about blocks:

* `nano.blocks.account(hash: string)`
* `nano.blocks.count(byType?: boolean)`
* `nano.blocks.chain(hash: string, count?: number)`
* `nano.blocks.history(hash: string, count?: number)`
* `nano.blocks.info(hashOrHahes: string | string[], details?: boolean)`
* `nano.blocks.pending(hash: string)`
* `nano.blocks.successors(block: string, count?: number)`

Methods to construct blocks:

* `nano.blocks.createOpen(block: OpenBlock)`
* `nano.blocks.createSend(block: SendBlock)`
* `nano.blocks.createReceive(block: ReceiveBlock)`
* `nano.blocks.createChange(block: ChangeBlock)`

And a method to publish a constructed block to the network:

* `nano.blocks.publish(block: string)`

### Convert

Allows you to convert `rai`, `krai`, and `mrai` amounts to and from their raw values.

* `nano.convert.toRaw(amount: string, denomination: 'rai' | 'krai' | 'mrai')`
* `nano.convert.fromRaw(amount: string, denomination: 'rai' | 'krai' | 'mrai')`

### Work

Allows you to generate and validate Proof of Work for a given block hash.

* `nano.work.generate(hash: string)`
* `nano.work.validate(work: string, hash: string)`

### Other

* `nano.available()`
* `nano.representatives()`
* `nano.deterministicKey(seed: string, index?: number)`
* `nano.minimumReceive.get()`
* `nano.minimumReceive.set(amount: string)`

## Calling RPC directly

If there's a method missing, or if you prefer to call RPC directly, you can use `nano.rpc`. You'll still get the full benefit of type checking and return types for applicable RPC calls.

```typescript
await nano.rpc('account_info', {account})
```

## Todos

* Use BigNumber, etc. to allow passing numbers
* TypeDoc site + add remaining method documentation
* Better argument checking / error handling
* Tests!
