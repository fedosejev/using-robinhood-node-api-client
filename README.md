# Testing unofficial Robinhood API Node client

Get Robinhood orders, convert them to CSV and write them to a file.

## 1. Install

```
npm install
```

_Optional:_ put your Robinhood username and password in `./robinhood.config.json` file.

## 2. Run

#### Create CSV file with orders

```
node app
```

#### Start server

Set port in `./server.config.json` file and run:


```
node server
```

## 3. Check `./results` directory

There you will find 2 files:
+ `robinhood_data.csv` - CSV file that you can now drop to http://stocktrading.report and see your stock trading results.
+ `raw_robinhood_data.json` - raw data received from Robinhood API in JSON format.

## Learn more

https://github.com/aurbano/robinhood-node

## Inspired by

https://github.com/markalfred/robinhood-to-csv
