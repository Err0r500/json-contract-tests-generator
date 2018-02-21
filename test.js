var fs = require('fs');

var contents = fs.readFileSync('testdata/simple.json');

class generator {
    constructor(funcToApply, value) {
        this.funcToApply = funcToApply;
        this.value = value;
    }

    get generate() {
        return this.funcToApply(this.value);
    }
}


class intWithMinConstrain extends generator {
    constructor(value) {
        super()
        this.value = value;
    }

    valid(min) {
        return min + 1
    }

    invalid(min) {
        return min - 1
    }

    get generateValid() {
        return new generator(this.valid, this.value).generate
    }
    get generateInValid() {
        return new generator(this.invalid, this.value).generate
    }
}

class intWithMaxConstrain extends generator {
    constructor(value) {
        super()
        this.value = value;
    }

    valid(min) {
        return min - 1
    }

    invalid(min) {
        return min + 1
    }

    get generateValid() {
        return new generator(this.valid, this.value).generate
    }
    get generateInValid() {
        return new generator(this.invalid, this.value).generate
    }
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
            tmp[key] = obj[key]["type"];
            if (obj[key]["type"] == "integer") {
                tmp[key] = [new intWithMinConstrain(12), new intWithMaxConstrain(1001)]
            }
        }
    });
    return tmp
};

var final = traverseObject(JSON.parse(contents))
var dataset = []

// todo recursive contruction too
const buildSet = (obj, valid) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key].isArray) {
            for (let i = 0; i < obj[key].length; i++) {
                var tmpObj = JSON.parse(JSON.stringify(final))
                if (valid) tmpObj[key] = obj[key][i].generateValid;
                else tmpObj[key] = obj[key][i].generateValid;
                dataset.push(tmpObj)
            }
        }
    });
};

buildSet(final, true)
console.log(dataset)