const gen = require('./_main')

class _Int extends gen.Generator {
    constructor(value) {
        super()
        if (typeof value != 'number' || value % 1 != 0) {
            throw new TypeError("a _Int constructor needs an int");
        }

        this.value = value;
    }

    get generateValid() {
        throw new TypeError("_Int generateValid called");        
    }
    
    get generateInvalid() {
        throw new TypeError("_Int generateInvalid called");        
    }
}

class IntWithMinConstrain extends _Int {
    constructor(value) {
        super(value)
    } 

    get generateValid() {
        return this.value
    }

    get generateInvalid() {
        return this.value - 1
    }
}

class IntWithMaxConstrain extends _Int {
    constructor(value) {
        super(value)
    }

    get generateValid() {
        return this.value
    }

    get generateInvalid() {
        return this.value + 1
    }
}

generate = (currentPath, intObj) => {
    let funcsToApply = []

    if (intObj.minimum) {
        funcsToApply.push(new IntWithMinConstrain(intObj.minimum))
    } else {
        funcsToApply.push(new IntWithMinConstrain(Number.MIN_SAFE_INTEGER))
    }

    if (intObj.maximum) {
        funcsToApply.push(new IntWithMaxConstrain(intObj.maximum))
    } else {
        funcsToApply.push(new IntWithMaxConstrain(Number.MAX_SAFE_INTEGER))
    }

    return new gen.Transformer(currentPath, funcsToApply)
}

module.exports = {
    generate,
    IntWithMinConstrain,
    IntWithMaxConstrain,
    _Int
};