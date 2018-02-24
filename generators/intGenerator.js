const gen = require('./_main')

/* 
constrains applicable to Int : 

- multipleOf int (drop if int == 1)

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
        if (typeof multipleOf != 'number' || multipleOf <= 0 || multipleOf % 1 != 0) {
            throw new TypeError("a _Int constructor needs multiplof to be an Int greater than zero");
        }

        this.value = value;
        this.multipleOf = multipleOf;
    }

    get generateValid() {
        throw new TypeError("_Int generateValid called");
    }

    get generateInvalid() {
        throw new TypeError("_Int generateInvalid called");
    }
}

var dirEnum = Object.freeze({"up":1, "down":-1})
function getClosestMultiple(initial, multiple = 1, direction = dirEnum.up) {
    while (initial % multiple != 0 || initial == 0){
        initial += direction
    }
    return initial
}

class IntWithMinConstrain extends _Int {
    constructor(value, exclusive = false, multipleOf) {
        super(value, multipleOf)
        this.exclusive = exclusive        
    }

    get generateValid() {
        return this.exclusive ? getClosestMultiple(this.value + 1, this.multipleOf) : getClosestMultiple(this.value, this.multipleOf)
    }
    
    get generateInvalid() {
        return this.exclusive ? getClosestMultiple(this.value, this.multipleOf, dirEnum.down) : getClosestMultiple(this.value - 1, this.multipleOf, dirEnum.down)
    }
}

class IntWithMaxConstrain extends _Int {
    constructor(value, exclusive = false, multipleOf) {
        super(value, multipleOf)
        this.exclusive = exclusive
    }

    get generateValid() {
        return this.exclusive ? getClosestMultiple(this.value - 1, this.multipleOf, dirEnum.down) : getClosestMultiple(this.value, this.multipleOf, dirEnum.down)
    }

    get generateInvalid() {
        return this.exclusive ? getClosestMultiple(this.value, this.multipleOf) : getClosestMultiple(this.value + 1, this.multipleOf)
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
        return this.exclusiveMinimum ? getClosestMultiple(this.minimum + 1, this.multipleOf, dirEnum.up) : getClosestMultiple(this.minimum, this.multipleOf, dirEnum.up)
    }

    get generateInvalid() {
        return getClosestMultiple(this.minimum + 1, this.multipleOf, dirEnum.up) + 1
    }
}

generate = (currentPath, intObj) => {
    let funcsToApply = []

    if (intObj.minimum) {
        funcsToApply.push(new IntWithMinConstrain(intObj.minimum, intObj.exclusiveMinimum, intObj.multipleOf))
    } else {
        funcsToApply.push(new IntWithMinConstrain(Number.MIN_SAFE_INTEGER, intObj.exclusiveMinimum, intObj.multipleOf))
    }

    if (intObj.maximum) {
        funcsToApply.push(new IntWithMaxConstrain(intObj.maximum, intObj.exclusiveMaximum, intObj.multipleOf))
    } else {
        funcsToApply.push(new IntWithMaxConstrain(Number.MAX_SAFE_INTEGER, intObj.exclusiveMaximum, intObj.multipleOf))
    }

    if (intObj.multipleOf) {
        funcsToApply.push(new IntWithMultipleOfConstrain(intObj))
    }

    return new gen.Transformer(currentPath, funcsToApply)
}

module.exports = {
    generate,
    IntWithMinConstrain,
    IntWithMaxConstrain,
    getClosestMultiple,
    dirEnum,
    _Int
};