var express = require('express');
var router = express.Router();

const Account = require('../../services/account');
const Transaction = require('../../models/transaction');

const prefix = '/account';

/**
 * Since by requirement there's only one account, It's kind of ok to create
 * that only instance here.
 */
const account = new Account();

/**
 * Get all transaction in the default account
 */
router.get('/', async function(req, res, next) {
    console.debug('all transactions');
    let allTransactions;
    try {
        allTransactions = await account.getAllTransactions();
    } catch (error) {
        next(error);
        return
    }
    
    res.send(allTransactions)
});

/**
 * Get the account balance
 */
router.get('/balance', async function(req, res, next) {
    console.debug('Balance');
    let accountBalance;
    try {
        accountBalance = await account.getBalance();
    } catch (error) {
        next(error);
        return
    }

    res.status(200).send(String(accountBalance))
});

/**
 * Get a specific transaction by ID
 */
router.get('/:transactionId', async function(req, res, next) {
    console.debug('in transaction id')
    const {transactionId} = req.params;

    if (!transactionId || transactionId.length !== 36) {
        res.status(401).send('Invalid Request')
    }
    let transaction;

    try {
        transaction = await account.getTransactionById(
            transactionId
        );
    } catch (error) {
        next(error);
        return
    }

    if (!transaction) {
        res.status(404).send(null);
    }

    res.status(200).send(transaction);
});

/**
 * Create new transaction
 */
router.post('/', async function(req, res, next) {
    console.debug('creating transaction');
    const { transactionDetails } = req.body;
    
    if (!transactionDetails) {
        res.status(400).send('Invalid Request. Mising transactionDetails');
        return;
    }

    const { type, amount } = transactionDetails;

    if (!type || !amount) {
        res.status(400).send('Invalid Request. Request include [type] and [amount]');
    }

    if (!Transaction.types.includes(type)) {
        res.status(400).send(`Invalid Request. Transaction Type must be one of ${Transaction.types}`)
    }

    const transaction = new Transaction(type, amount);
    
    let transactionInserted;
    try {
        transactionInserted = await account.putTransaction(transaction);
    } catch (error) {
        next(error);
        return
    }

    if (transactionInserted) {
        res.status(201).send('ok');
    } else {
        res.status(400).send('Insuficient Funds');
    }
});



module.exports = { router, prefix };
