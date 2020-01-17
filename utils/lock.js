const uuid = require('uuid');

class Lock {
    constructor (isLocked = false) {
        this.id = uuid.v4();
        this._isLocked = isLocked;
    }

    lock () {
        this._isLocked = true;
    }

    unlock () {
        this._isLocked = false;
    }

    isLocked() {
        return this._isLocked;
    }
}

module.exports = Lock;
