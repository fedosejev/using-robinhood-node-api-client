# Testing unofficial Robinhood API Node client

Get Robinhood orders, convert them to CSV and write them to a file.

## 1. Install

```
npm install
```

_Optional:_ put your Robinhood username and password to `./robinhood.config.json` file.

## 2. Run

```
node app
```

## 3. Check `./results` directory

There you will find 2 files:
+ `robinhood_data.csv` - CSV file that you can now drop to http://stocktrading.report and see your stock trading results.
+ `raw_robinhood_data.json` - raw data received from Robinhood API in JSON format.

## Learn more

https://github.com/aurbano/robinhood-node

## Inspired by

https://github.com/markalfred/robinhood-to-csv
