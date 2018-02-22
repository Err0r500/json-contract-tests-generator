var fs = require('fs');

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


class IntWithMinConstrain extends Generator {
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

class IntWithMaxConstrain extends Generator {
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

const genIntArray = (intObj) => {
    var tmp = []
    if (intObj.minimum) {
        tmp.push(new IntWithMinConstrain(intObj.minimum))
    } else {
        tmp.push(new IntWithMinConstrain(0))
    }

    if (intObj.maximum) {
        tmp.push(new IntWithMaxConstrain(intObj.maximum))
    } else {
        tmp.push(new IntWithMaxConstrain(100000))
    }
    return tmp
}

const traverseObject = (obj) => {
    var tmp = {}
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            tmp = traverseObject(obj[key]) // recurse on root object
        } else
        if (key == "required") {
            tmp["required_fields"] = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"]) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            if (obj[key]["type"] == "integer") {
                tmp[key] = genIntArray(obj[key])
            }
            // tmp[key] = obj[key]["type"];
        }
    });
    return tmp
};


// todo recursive contruction too
const buildSet = (obj, valid) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key].isArray) {
            for (let i = 0; i < obj[key].length; i++) {
                var tmpObj = JSON.parse(JSON.stringify(final))
                if (valid) tmpObj[key] = obj[key][i].generateValid;
                else tmpObj[key] = obj[key][i].generateInvalid;

                dataset.push(tmpObj)
            }
        }
    });
};

var dataset = []
var contents = fs.readFileSync('testdata/simple.json');
var final = traverseObject(JSON.parse(contents))

buildSet(final, false)
console.log(final)
console.log(' ')
console.log(dataset)