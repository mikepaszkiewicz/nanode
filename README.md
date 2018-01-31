# Nano Client

Dead simple, promise-based client for interacting and building services on top of the NANO network.

Not hosting your own node? [Sign up for node access and get your API key at raiblocks.club](https://www.raiblocks.club/node-api) 

## Usage

`npm install nano-client-node`

Initiate the client with your API key and a valid RPC url. Optionally pass your address and private key to the constructor.

Not sure what your private key is? Call `nano.get_deterministic_key()` with the account seed to get all relevant account information.

```typescript
import Nano from 'nano-client-node'
const nano = new Nano({
    api_key: process.env.API_KEY,
    url: `https://rpc.raiblocks.club`,
    origin_address: process.env.SENDER_WALLET,
    origin_key: process.env.SENDER_WALLET_PRIVATE_KEY
})

nano.send('0.1', process.env.RECIPIENT_WALLET).then((res) => {
    ...
}).catch((err) => {
    ...
})
```

## Todos
  - Receive call
  - Documentation on remaining calls
