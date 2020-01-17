const uuid = require('uuid');
const Lock = require('../utils/lock');

class Account {
    constructor() {
        this.id = uuid.v4();
        this.transactions = [];
        this.lock = new Lock();
    }

    async getAllTransactions () {
        return this.transactions
    }
    
    async getTransactionById (transactionId) {
        return this.transactions.find((transaction) => {
            return transaction.id === transactionId
        });
    }
    
    async putTransaction (transaction) {
        this.transactions.push(transaction);
        return transaction;
    }
}

module.exports = Account
