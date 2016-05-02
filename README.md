# Testing unofficial Robinhood API Node client

## 1. Install

```
npm install
```

## 2. Change `config.json`

Put your Robinhood app username and password.

## 3. Run

```
node app
```

### 4. Check `./results` directory

There you will find 2 files:
+ `robinhood_data.csv` - CSV file that you can now drop to http://stocktrading.report and see your stock trading results.
+ `raw_robinhood_data.json` - raw data received from Robinhood API in JSON format.

## Learn more

https://github.com/aurbano/robinhood-node

## Alternative

https://github.com/markalfred/robinhood-to-csv
