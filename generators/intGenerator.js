const gen = require('./generators')

IntWithMinConstrain = class IntWithMinConstrain extends gen.Generator {
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

IntWithMaxConstrain = class IntWithMaxConstrain extends gen.Generator {
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

generate = (currentPath, intObj) => {
    var tmp = []
    if (intObj.minimum) {
        tmp.push(new generators.IntWithMinConstrain(intObj.minimum))
    } else {
        tmp.push(new generators.IntWithMinConstrain(0))
    }
    
    if (intObj.maximum) {
        tmp.push(new generators.IntWithMaxConstrain(intObj.maximum))
    } else {
        tmp.push(new generators.IntWithMaxConstrain(100000))
    }
    
    return {
        path: currentPath,
        funcs: tmp
    }
}

module.exports = {
    generate,
};