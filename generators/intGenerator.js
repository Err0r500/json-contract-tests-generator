const gen = require('./_main')

/* 
constrains applicable to Int : 

- multipleOf int

- maximum int 
- exclusiveMaximum bool

- minimum int
- exclusiveMinimum bool

*/

class _Int extends gen.Generator {
    constructor(value, multipleOf = 1) {
        super()
        if (typeof value != 'number' || value % 1 != 0) {
            throw new TypeError("a _Int constructor needs an int");
        }
        this.value = value;


        if (typeof multipleOf != 'number' || multipleOf <= 0 || multipleOf % 1 != 0) {
            throw new TypeError("a _Int constructor needs multiplof to be an Int greater than zero");
        }
        this.multipleOf = multipleOf;
    }

    get generateValid() {
        throw new TypeError("_Int generateValid called");
    }

    get generateInvalid() {
        throw new TypeError("_Int generateInvalid called");
    }
}

class IntWithMinConstrain extends _Int {
    constructor(intObj) {
        super(intObj.minimum, intObj.multipleOf)
        this.exclusive = intObj.exclusiveMinimum
    }

    get generateValid() {
        return getClosestMultiple(this.exclusive ? this.value + 1 : this.value, this.multipleOf)
    }

    get generateInvalid() {
        if (this.value === Number.MIN_SAFE_INTEGER){
            return undefined
        }
        return getClosestMultiple(this.exclusive ? this.value : this.value - 1, this.multipleOf, dirEnum.down)
    }
}

class IntWithMaxConstrain extends _Int {
    constructor(intObj) {
        super(intObj.maximum, intObj.multipleOf)
        this.exclusive = intObj.exclusiveMaximum
    }

    get generateValid() {
        return getClosestMultiple(this.exclusive ? this.value - 1 : this.value, this.multipleOf, dirEnum.down)
    }

    get generateInvalid() {
        if (this.value === Number.MAX_SAFE_INTEGER){
            return undefined
        }
        return getClosestMultiple(this.exclusive ? this.value : this.value + 1, this.multipleOf)
    }
}

class IntWithMultipleOfConstrain extends gen.Generator {
    constructor(intObj) {
        super()

        this.multipleOf = intObj.multipleOf
        this.minimum = intObj.minimum
        this.maximum = intObj.maximum
        this.exclusiveMinimum = intObj.exclusiveMinimum
        this.exclusiveMaximum = intObj.exclusiveMaximum
    }

    get generateValid() {
        return getClosestMultiple(this.exclusiveMinimum ? this.minimum + 1 : this.minimum, this.multipleOf, dirEnum.up)
    }

    get generateInvalid() {
        return getClosestMultiple(this.minimum + 1, this.multipleOf, dirEnum.up) + 1
    }
}

generate = (currentPath, intObj) => {
    let funcsToApply = []

    if (typeof intObj.minimum  === 'undefined') {
        intObj.minimum = Number.MIN_SAFE_INTEGER
    }
    funcsToApply.push(new IntWithMinConstrain(intObj))

    if (typeof intObj.maximum === 'undefined') {
        intObj.maximum = Number.MAX_SAFE_INTEGER
    }
    funcsToApply.push(new IntWithMaxConstrain(intObj))

    if (intObj.multipleOf) {
        funcsToApply.push(new IntWithMultipleOfConstrain(intObj))
    }

    return new gen.Transformer(currentPath, funcsToApply)
}

var dirEnum = Object.freeze({
    "up": 1,
    "down": -1
})

function getClosestMultiple(initial, multiple = 1, direction = dirEnum.up) {
    if (initial === 0) {
        return 0
    }
    while (initial % multiple != 0 || initial == 0) {
        initial += direction
    }
    return initial
}


module.exports = {
    generate,
    IntWithMinConstrain,
    IntWithMaxConstrain,
    getClosestMultiple,
    dirEnum,
    _Int
};