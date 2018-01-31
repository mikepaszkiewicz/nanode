# Nano Client

Dead simple, promise-based client for interacting and building services on top of the NANO network.

Not hosting your own node? [Sign up for node access](https://www.raiblocks.club/node-api) and get your API key at raiblocks.club

## Usage

`npm install nano-client`

Initiate the client with your API key and origin key / address.
Not sure what your private key is? Call `nano.get_deterministic_key()` with the account seed to get all relevant account information

```typescript
import Nano from 'nano-client'
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
