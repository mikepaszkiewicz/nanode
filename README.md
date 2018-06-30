# Nano Client by [Nanode](https://www.nanode.co/)

Dead simple, promise-based client for interacting and building services on top of the NANO network, a next-generation cryptocurrency created by Colin LeMahieu with nearly instant transactions and no fees. [Learn more in the Nanode docs.](https://www.nanode.co/docs) ⚡️

If you've worked with NANO before, you probably have experienced it's learning curve. The community is amazingly helpful and growing fast,
but the documentation and guides to working with it currently leave a lot to be desired.

**This library is designed to get anyone, even a total beginner, up and running building services on NANO in just a few minutes.** At it's core,
this package is a wrapper around the official [RPC protocol](https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol) that does a few things:

1.  abstracts away some of the idiosyncracies and quirks with the RPC API,
2.  exposes some easy top-level account methods like `send()` and `receive()` that do everything automatically so you don't have to know about Proof of Work, creating, signing, publishing, etc
3.  allows you to specify amounts in Nano without dealing with "raw" 128-bit integers

This library works natively with the [Nanode Node API](https://www.nanode.co/node-api) as well as the [official Nano node software](https://github.com/nanocurrency/raiblocks), so there's no vendor lock-in.

[Sign up for Node API to get 1,000 free API calls per month!](https://www.nanode.co/node-api) It's the easiest way to build with Nano.

## Install

`npm install nanode`

## Getting Started

This library is built with TypeScript, and I highly reccommend you take advantage of your code editor's Intellisense features.

### Nanode Node API

```typescript
const {Nano} = require('nanode')
const nano = new Nano({apiKey: process.env.NANODE_API_KEY})
```

### Your own Nano RPC server

```typescript
const {Nano} = require('nanode')
const nano = new Nano({url: 'http://localhost:7076'})
```

### Debug mode

To enable some helpful logs, pass `debug: true` as a paramater in the constructor object.

## Working with accounts

### Generate an account

It's easy to generate a new random account. You'll get the account's private and public keys along with its address.

```typescript
const {privateKey, publicKey, address} = await nano.key.create()
```

### Open account

In order to open an account and let the network know it exists, we'll need publish an `open` block. An account can't be opened with zero balance, so we'll first need to send some Nano to our account's address from our own wallet or [NanoFaucet](https://www.nanofaucet.org/), then call `open()`.

```typescript
await nano.account(PRIVATE_KEY).open()
```

### Send funds

```typescript
await nano.account(PRIVATE_KEY).send(0.01, RECIPIENT_ADDRESS)
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

```typescript
const account = nano.account(PRIVATE_KEY)
```

* `account.open(representative?: string, hash?: string)`
* `account.send(nanoAmount: string | number, address: string)`
* `account.receive(hash?: string)`
* `account.change(representative: string)`
* `account.rawBalance()`
* `account.nanoBalance()`
* `account.blockCount()`
* `account.history(count?: number)`
* `account.info()`
* `account.publicKey()`
* `account.ledger(count?: number, details?: boolean)`
* `account.pending(count?: number, minNanoThreshold?: string | number)`
* `account.representative()`
* `account.weight()`

### Keys

Used for generating accounts and extrapolating public keys/addresses from private keys.

* `nano.key.create()`
* `nano.key.expand(privateKey: string)`

### Accounts

Account methods take a single account string or in some cases, an array of accounts.

* `nano.accounts.get(publicKey: string)`
* `nano.accounts.rawBalance(account: string)`
* `nano.accounts.nanoBalance(account: string)`
* `nano.accounts.balances(accounts: string[])`
* `nano.accounts.blockCount(account: string)`
* `nano.accounts.frontiers(accounts: string[])`
* `nano.accounts.history(account: string, count?: number)`
* `nano.accounts.info(account: string)`
* `nano.accounts.key(account: string)`
* `nano.accounts.ledger(account: string, count?: number, details?: boolean)`
* `nano.accounts.pending(account: string, count?: number, minNanoThreshold?: string | number)`
* `nano.accounts.pendingMulti(accounts: string[], count?: number, minNanoThreshold?: string | number)`
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

* `nano.convert.toRaw(amount: string | number, denomination: 'rai' | 'krai' | 'mrai')`
* `nano.convert.fromRaw(amount: string, denomination: 'rai' | 'krai' | 'mrai')`

### Work

Allows you to generate and validate Proof of Work for a given block hash.

* `nano.work.generate(hash: string)`
* `nano.work.validate(work: string, hash: string)`

### Other

* `nano.available()`
* `nano.representatives()`
* `nano.deterministicKey(seed: string, index?: string | number)`
* `nano.minimumReceive.get()`
* `nano.minimumReceive.set(nanoAmount: string | number)`

## Calling RPC directly

If there's a method missing, or if you prefer to call RPC directly, you can use `nano.rpc`. You'll still get the full benefit of type checking and return types for applicable RPC calls.

```typescript
await nano.rpc('account_info', {account})
```

## Todos

* TypeDoc site + add remaining method types
* Tests!
