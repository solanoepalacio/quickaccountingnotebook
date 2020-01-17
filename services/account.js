const uuid = require('uuid');
const Lock = require('../utils/lock');

class Account {
    constructor() {
        this.id = uuid.v4();
        this.transactions = [];
        this.lock = new Lock();
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
            this.transactions.push(transaction);
            this.lock.unlock();
            return transaction;
        }
        return this.waitForLock('putTransaction', transaction);
    }
}

module.exports = Account
