const intGen = require('./generators/intGenerator')
const h = require('./helpers')

const genArray = (currentPath, obj) => {
    if (currentPath == '') {
        throw new TypeError("genArray received an empty string as path");
    }

    switch (obj.type) {
        case "integer":
            return intGen.generate(currentPath, obj)

        default:
            throw new TypeError("genArray unknown type" + typeof obj)

    }
}

const traverseObject = (obj, currentPath = '', arrayToOutput = [], Cb) => {
    let tmp = {}
    let tmpPath = currentPath

    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            // obj is the object root otherwise the recursion is would have been called on obj[key]["properties"]
            tmp.required_fields = []
            tmp.model = traverseObject(obj[key], currentPath, arrayToOutput, Cb)
        } else if (key == "required") {
            tmp.required_fields = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"], tmpPath += '.' + key, arrayToOutput, Cb) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            tmp[key] = obj[key]["type"]; // for the model
            arrayToOutput.push(Cb(currentPath + '.' + key, obj[key])) // for the transformers
        }
    });
    return tmp
};

module.exports = {
    genArray,
    traverseObject,
}