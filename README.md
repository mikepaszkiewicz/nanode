# Nano Client

Dead simple, promise-based client for interacting and building services on top of the NANO network, a next-generation cryptocurrency created by Colin LeMahieu with nearly instant transactions and no fees. [Learn more on the official repo](https://nanode.co/node-api) ⚡️

If you've worked with NANO before, you probably have experienced it's learning curve. The community is amazingly helpful and growing fast,
but the documentation and guides to working with it currently leave a lot to be desired.

This library is designed to get anyone, even a total beginner, up and running building services on NANO in just a few minutes. At it's core,
this package is a wrapper around the official [RPC protocol](https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol) that does a few things:

    1. eliminates some of the idiosyncracies and quirks with the RPC API,
    2. exposes some top-level methods like `Nano.send()` and `Nano.recieve()`, so you don't have to know about creating, signing, publishing, etc.

Want to build with NANO, but not running a full node? [Sign up for node access and get your API key at nanode.co](https://nanode.co/node-api)

## Install

`npm install nanode`

## Usage

### Connect

Initiate the client with your API key and a valid RPC url. Optionally pass your address and private key to the constructor.

Not sure what your private key is? Call `nano.get_deterministic_key()` with the account seed to get all relevant account information.

```typescript
import Nano from 'nanode'
const nano = new Nano({
  api_key: process.env.API_KEY,
  url: `https://rpc.raiblocks.club`,
  origin_address: process.env.SENDER_WALLET, // wallet for the 'controlling' account
  origin_key: process.env.SENDER_WALLET_PRIVATE_KEY // key for the 'controlling' account
})

nano
  .send(
    '0.1',
    'xrb_3hk1e77fbkr67fwzswc31so7zi76g7poek9fwu1jhqxrn3r9wiohwt5hi4p1'
  )
  .then(hash => {
    console.log('Send block published, hash: ', hash)
  })
```

## Todos

* Receive call
* Documentation on remaining calls
