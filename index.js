const _ = require('lodash'),
  async = require('async'),
  fs = require('fs'),
  isImage = require('is-image'),
  klaw = require('klaw'),
  moment = require('moment'),
  parkRanger = require('park-ranger')(),
  readline = require('readline');

var budgets = {
    discretionary: process.env.FORECEIPT_ANALYZER_DISCRETIONARY_BUDGET,
    food: process.env.FORECEIPT_ANALYZER_FOOD_BUDGET
  },
  monthlyTransactions = {},
  recurringMerchants = [];

var getRecurringMerchants = (done) => {
  var lineReader = readline.createInterface({
    input: fs.createReadStream('.recurring-merchants')
  });

  lineReader.on('line', function (line) {
    recurringMerchants.push(line);
  }).on('close', done);
};

var getTransactions = (done) => {
  klaw(process.env.FORECEIPT_ANALYZER_DIR).on('data', file => {
    if (typeof file.path !== 'string' || isImage(file.path)) { return; }

    fs.readFile(file.path, (error, data) => {
      if (error) { return; }

      try {
        var transaction = JSON.parse(data);

        if (transaction.status !== 'Split' && recurringMerchants.indexOf(transaction.merchant) === -1) {
          let month = moment(transaction.receipt_date).format('YYYY-MM');

          if (!monthlyTransactions[month]) {
            monthlyTransactions[month] = [];
          }

          monthlyTransactions[month].push(transaction);
        }
      } catch (error) {}
    });
  }).on('end', done);
}

var analyzeMonthlyTransactions = (done) => {
  var months = Object.keys(monthlyTransactions).sort();

  months.forEach((month) => {
    console.log('*******', month, '*******');

    let transactions = monthlyTransactions[month],
      discretionaryAmount = 0,
      foodAmount = 0;

    transactions.forEach((transaction) => {
      if (transaction.category) {
        if (transaction.category.includes('Food & Dining')) {
          foodAmount += new Number(transaction.amount);
        } else if (!transaction.category.includes('Travel->Air Travel') && !transaction.category.includes('Travel->Hotel')) {
          discretionaryAmount += new Number(transaction.amount);
        }
      }
    });

    console.log('Total transactions: ' + transactions.length);
    console.log(`Total discretionary amount: €${Math.round(discretionaryAmount)} (${Math.round(discretionaryAmount / budgets['discretionary'] * 100)}%)`);
    console.log(`Total food amount: €${Math.round(foodAmount)} (${Math.round(foodAmount / budgets['food'] * 100)}%)`, '\n');
  });

  done();
};

async.waterfall([getRecurringMerchants, getTransactions, analyzeMonthlyTransactions]);