const gen = require('./_main')

/* 
constrains applicable to Int : 

- multipleOf is silently ignored

- maximum float
- exclusiveMaximum bool

- minimum float
- exclusiveMinimum bool

*/

// jest doesn't detect diff == to Number.EPSILON
const EPSILON = Number.EPSILON * 10

class _Float extends gen.Generator {

    constructor(value) {
        super()
        if (typeof value != 'number' || !Number.isFinite(value)) {
            throw new TypeError("a _Float constructor needs a finite value");
        }
        this.value = value;
    }

    get generateValid() {
        throw new TypeError("_Float generateValid called");
    }

    get generateInvalid() {
        throw new TypeError("_Float generateInvalid called");
    }
}

class withMinConstrain extends _Float {
    constructor(floatObj) {
        super(floatObj.minimum)
        this.exclusive = floatObj.exclusiveMinimum
    }

    get generateValid() {
        return this.exclusive ? this.value + EPSILON : this.value
    }

    get generateInvalid() {
        if (this.value === Number.MIN_VALUE) {
            return undefined
        }
        return this.exclusive ? this.value : this.value - EPSILON
    }
}

class withMaxConstrain extends _Float {
    constructor(floatObj) {
        super(floatObj.maximum)
        this.exclusive = floatObj.exclusiveMaximum
    }

    get generateValid() {
        return this.exclusive ? this.value - EPSILON : this.value
    }

    get generateInvalid() {
        if (this.value === Number.MAX_VALUE) {
            return undefined
        }
        return this.exclusive ? this.value : this.value + EPSILON
    }
}

generate = (currentPath, floatObj) => {
    let funcsToApply = []

    if (typeof floatObj.minimum === 'undefined') {
        floatObj.minimum = Number.MIN_VALUE
    }
    funcsToApply.push(new withMinConstrain(floatObj))

    if (typeof floatObj.maximum === 'undefined') {
        floatObj.maximum = Number.MAX_VALUE
    }
    funcsToApply.push(new withMaxConstrain(floatObj))

    return new gen.Transformer(currentPath, funcsToApply)
}

var dirEnum = Object.freeze({
    "up": 1,
    "down": -1
})


module.exports = {
    generate,
    withMinConstrain,
    withMaxConstrain,
    dirEnum,
    EPSILON,
    _Float
};