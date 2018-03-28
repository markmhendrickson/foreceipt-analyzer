# Foreceipt analyzer

This repository contains the source code for a script that analyzes all transaction files stored by [Foreceipt](http://www.foreceipt.com/) in Google Drive and outputs various insights.

I created it to better understand my monthly manual expenditures, particularly those falling within my food and discretionary budgets, to know just how much I've been over- or under-spending.

## Setting up the environment

The code requires the following environment variables to run. The following environment variables can be declared by adding a file named `.env` (in [INI format](https://en.wikipedia.org/wiki/INI_file)) to the base directory, assuming they're not declared elsewhere in the system already. Such a file will be ignored by Git.

- `FORECEIPT_ANALYZER_DISCRETIONARY_BUDGET`: Size of monthly discretionary budget in euros (e.g. `500`)
- `FORECEIPT_ANALYZER_FOOD_BUDGET`: Size of monthly food budget in euros (e.g. `300`)
- `FORECEIPT_ANALYZER_DIR`: System path to Google Drive folder created by Foreceipt (e.g. `/Users/username/Google Drive/Foreceipt`)

## Running the script

Once the environment is ready per above, and [Node.js](http://nodejs.org/) with [NPM](https://www.npmjs.com/) is installed, simply run `npm install` to install dependencies and `node index.js` to run the script.
