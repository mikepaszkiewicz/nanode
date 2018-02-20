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

## Usage

This library is built with TypeScript, and I highly reccommend you take advantage of your code editor's Intellisense features.

Note: Due to the use of 128-bit integers, all numeric amounts must be provided as strings, and will be returned as strings.

### Connect

#### Nanode Node API

```typescript
import Nano from 'nanode'
const nano = new Nano({api_key: process.env.NANODE_API_KEY})
```

#### Your own Nano RPC server

```typescript
import Nano from 'nanode'
const nano = new Nano({url: 'http://localhost:7076'})
```

### Open account

Now that we're connected, we need to 'open' the account. Opening an account is a bit of a catch-22 - it requires any amount to be sent to the address from a funded account before account is actually open.

```typescript
//examples/open.ts

import Nano from './init'
//create a new key
const target = await Nano.key.create()

console.log(`Initializing account ${target.account} with funds..`)

//send new account init funds from our walet
const hash = await Nano.send('0.01', target.account)

//open block with send's hash
const hash = await Nano.open(
  hash,
  process.env.DEFAULT_REP,
  target.private,
  target.public
)
console.log(`Open block published with hash: ${hash}`)
```

### Send and receive

Sending and receiving are simple one liners. Note that the send amount must be a string, and the `receive()` method will receive the latest pending block for the receiving account.

```typescript
// Send from account 1
const senderPrivateKey =
  '801E6A1601D95FFDF8A0A355EE8615319CC7B8D9C9307CA14BACA437427D6D81'
const receiverAddress =
  'xrb_3nnz4k6kzmq5eseb9ekrybnscsb8romzhgwk1qyrzrabwt991q1jx7zb44m9'
await nano.account(senderPrivateKey).send('0.01', receiverAddress)

// Receive with account 2
const receiverPrivateKey =
  'DD6DA634FEAEC2C631481E59DB5D4CC1C410CF9292CDDB149CF60E2B39C45A97'
await nano.account(receiverPrivateKey).receive()
```

## Full list of methods

If you aren't sure about some of the arguments, they're available as types in your editor, or in the official RPC guide. Full TypeDoc documentation is on the way!

### Top-level calls

if you only need to send and recieve NANO, **these methods should technically be the only ones you need**, per the examples above:

* `nano.open()`
* `nano.send()`
* `nano.receive()`
* `nano.change()`

### Accounts

Account methods take a single account string or in some cases, an array of accounts.

* `nano.accounts.get()`
* `nano.accounts.balance()`
* `nano.accounts.balances()`
* `nano.accounts.block_count()`
* `nano.accounts.frontiers()`
* `nano.accounts.history()`
* `nano.accounts.info()`
* `nano.accounts.key()`
* `nano.accounts.ledger()`
* `nano.accounts.pending()`
* `nano.accounts.representative()`
* `nano.accounts.weight()`

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

## Todos

* Use BigNumber, etc. to allow passing numbers
* TypeDoc site + add remaining method documentation
* Better argument checking / error handling
* Tests!
