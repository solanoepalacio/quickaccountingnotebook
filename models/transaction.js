const uuid = require('uuid');

class Transaction {
    static types = ['debit', 'credit'];

    constructor(type, amount, date = new Date()) {
        this.id = uuid.v4();
        this.type = type;
        this.amount = amount;
        this.date = date;
    }
}

module.exports = Transaction;