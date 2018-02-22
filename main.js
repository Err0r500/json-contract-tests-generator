var fs = require('fs');
var generators = require('./generators')

const genIntArray = (currentPath, intObj) => {
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

const traverseObject = (obj, currentPath = '', arrayToOutput = []) => {
    var tmp = {}
    var tmpPath = currentPath
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            tmp = traverseObject(obj[key], currentPath, arrayToOutput) // recurse on root object
        } else if (key == "required") {
            tmp.required_fields = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"], tmpPath+= '.' + key, arrayToOutput) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            if (obj[key]["type"] == "integer") {
                arrayToOutput.push(genIntArray(currentPath + '.' + key, obj[key]))
            }
            tmp[key] = obj[key]["type"];
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
console.log(model)
console.log(' ')
console.log(dataset)