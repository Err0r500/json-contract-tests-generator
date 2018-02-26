const gen = require('./_main')

/* 
constrains applicable to string : 

- minLength int
- maxLength int
- pattern string
- format string

*/


function genRandomString(length) {
    return Array(length).join().split(',').map(() => String.fromCharCode(Math.floor(Math.random() * 65535 ))).join('');
}

class _String extends gen.Generator {
    constructor(value) {
        super()
        if (typeof value != 'number' || !Number.isFinite(value)) {
            throw new TypeError("a _String constructor needs a finite value");
        }
        this.value = value;
    }

    get generateValid() {
        throw new TypeError("_String generateValid called");
    }

    get generateInvalid() {
        throw new TypeError("_String generateInvalid called");
    }
}

class withMinLengthConstrain extends _String {
    constructor(stringObj) {
        if (typeof stringObj.minLength != 'number' || !Number.isInteger(stringObj.minLength) || stringObj.minLength < 0) {
            throw new TypeError("a minLength should be a positive int");
        }
        this.minLength = stringObj.minLength
    }

    get generateValid() {
        return this.value
    }

    get generateInvalid() {
        if (this.value === Number.MIN_SAFE_INTEGER) {
            return undefined
        }
        return this.value
    }
}

class withMaxLengthConstrain extends _String {
    constructor(stringObj) {
        if (typeof stringObj.minLength != 'number' || !Number.isInteger(stringObj.minLength) || stringObj.minLength < 0) {
            throw new TypeError("a minLength should be a positive int");
        }
        this.minLength = stringObj.minLength
    }

    get generateValid() {
        return this.value
    }

    get generateInvalid() {
        if (this.value === Number.MAX_SAFE_INTEGER) {
            return undefined
        }
        return this.value
    }
}

generate = (currentPath, stringObj) => {
    let funcsToApply = []

    if (typeof stringObj.minLength === 'undefined') {
        stringObj.minLength = Number.MIN_SAFE_INTEGER
    }
    funcsToApply.push(new withMinLengthConstrain(stringObj))

    if (typeof stringObj.maxLength === 'undefined') {
        stringObj.maxLength = Number.MAX_SAFE_INTEGER
    }
    funcsToApply.push(new withMaxLengthConstrain(stringObj))

    return new gen.Transformer(currentPath, funcsToApply)
}

module.exports = {
    generate,
    withMinLengthConstrain,
    withMaxLengthConstrain,
    _String,
    genRandomString,
};