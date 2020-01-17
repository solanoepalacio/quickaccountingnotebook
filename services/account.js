const uuid = require('uuid');
const Lock = require('../utils/lock');

class Account {
    constructor (initialBalance = 0) {
        this.id = uuid.v4();
        this.transactions = [];
        this.lock = new Lock();
        this.balance = initialBalance;
    }

    waitForLock (methodName, ...args) {
        return new Promise((resolve) => {
            setTimeout(() => {
               resolve(this[methodName](...args)) 
            });
        })
    }

    async getAllTransactions () {
        if (!this.lock.isLocked()) {
            return this.transactions;
        }

        return this.waitForLock('getAllTransactions');
    }
    
    async getTransactionById (transactionId) {
        if (!this.lock.isLocked()) {
            return this.transactions.find((transaction) => {
                return transaction.id === transactionId
            });
        }

        return this.waitForLock('getTransactionById', transactionId);
    }
    
    async putTransaction (transaction) {
        if (!this.lock.isLocked()) {
            this.lock.lock()

            let newBalance;
            if (transaction.type === 'debit') {
                newBalance = this.balance - transaction.amount;
                if (newBalance < 0) {
                    this.lock.unlock();
                    return false
                };
            } else if (transaction.type === 'credit') {
                newBalance = this.balance + transaction.amount;
            } else {
                throw new Error('TransactionTypeNotSupported');
            }

            this.balance = newBalance;

            this.transactions.push(transaction);
            
            this.lock.unlock();

            return transaction;
        }
        return this.waitForLock('putTransaction', transaction);
    }

    async getBalance () {
        if (!this.lock.isLocked()) {
            return this.balance;
        }

        return this.waitForLock('getBalance');
    }
}

module.exports = Account
