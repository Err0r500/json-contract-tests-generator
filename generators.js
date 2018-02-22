var exports = module.exports = {};

class Generator {
    constructor() {
        if (new.target === Generator) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if ('generateValid' in this === false) {
            throw new TypeError("Must override method generateValid");
        }
        if ('generateInvalid' in this === false) {
            throw new TypeError("Must override method generateInvalid");
        }
    }
}


exports.IntWithMinConstrain = class IntWithMinConstrain extends Generator {
    constructor(value) {
        super()
        this.value = value;
    }

    get generateValid() {
        return this.value
    }
    get generateInvalid() {
        return this.value - 1
    }
}

exports.IntWithMaxConstrain = class IntWithMaxConstrain extends Generator {
    constructor(value) {
        super()
        this.value = value;
    }

    get generateValid() {
        return this.value
    }

    get generateInvalid() {
        return this.value + 1
    }
}