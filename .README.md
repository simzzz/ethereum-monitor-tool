# Transaction Watchdog

### Requirements:

- Node.js
- Postgres (by default will connect with user: postgres, pass: 123)
- ENV file with INFURA_URL and INFURA_WS_URL

### Instructions:

1. `yarn install`
2. `yarn run seed`
3. `yarn start` or `yarn run dev`

### Example config with all fields:

```json
{
  "name": "AllInOne",
  "rules": {
    "minValue": "0",
    "maxValue": "1000000000000000000000",
    "fromAddress": "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
    "toAddress": "0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7",
    "minGas": 0,
    "maxGas": 1000000
  },
  "blockDelay": 1
}
```

To change default configuration loo at defaultConfig.json. We should have at least 1 rule set.
