# Nano Client

Dead simple, promise-based client for interacting and building services on top of the NANO network.

Not hosting your own node? [Sign up for node access and get your API key at nanode.co](https://nanode.co/node-api) 

## Usage

`npm install nanode`

# Connect
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

nano.send('0.1', 'xrb_3hk1e77fbkr67fwzswc31so7zi76g7poek9fwu1jhqxrn3r9wiohwt5hi4p1').then((hash) => {
    console.log('Send block published, hash: ', hash)
})
```

## Todos
  - Receive call
  - Documentation on remaining calls
