var fs = require('fs');
var intGen = require('./generators/intGenerator')

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

const traverseObject = (obj, currentPath = '', arrayToOutput = []) => {
    var tmp = {}
    var tmpPath = currentPath
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            tmp = traverseObject(obj[key], currentPath, arrayToOutput) // recurse on root object
        } else if (key == "required") {
            tmp.required_fields = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"], tmpPath += '.' + key, arrayToOutput) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            arrayToOutput.push(genArray(currentPath + '.' + key, obj[key]))
            // tmp[key] = obj[key]["type"];
        }
    });
    return tmp
};

const buildDataSet = (jsonSchemaPath, model = {}, dataset = []) => {
    var contents = fs.readFileSync(jsonSchemaPath);
    model = traverseObject(JSON.parse(contents), '', dataset)
}

var dataset = []
var model = {}
buildDataSet('testdata/simple.json', model, dataset)

module.exports = {
    genArray,
}