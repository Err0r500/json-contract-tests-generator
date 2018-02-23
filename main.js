const intGen = require('./generators/intGenerator')
const h = require('./helpers')

const genArray = (currentPath, obj) => {
    if (currentPath == '') {
        throw new TypeError("genArray received an empty string as path");
    }

    switch (typeof obj) {
        case "number":
            if (obj % 1 == 0) {
                return intGen.generate(currentPath, obj)
            } else {
                throw new TypeError("genArray unHandled type" + typeof obj)
            }
            break

        default:
            // throw new TypeError("genArray unknown type" + typeof obj)

    }
}

const traverseObject = (obj, currentPath = '', arrayToOutput = [], Cb) => {
    var tmp = {}
    var tmpPath = currentPath
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            tmp = traverseObject(obj[key], currentPath, arrayToOutput, Cb) // recurse on root object
        } else if (key == "required") {
            tmp.required_fields = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"], tmpPath += '.' + key, arrayToOutput, Cb) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            arrayToOutput.push(Cb(currentPath + '.' + key, obj[key]))
            tmp[key] = obj[key]["type"];
        }
    });
    return tmp
};

const buildDataSet = (jsonSchemaPath, model = {}, dataset = [], Cb) => {
    model = traverseObject(h.objectFromFile(jsonSchemaPath), '', dataset, Cb)
    console.log(model)
}

module.exports = {
    genArray,
    buildDataSet,
    traverseObject,
}