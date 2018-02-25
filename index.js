const dataset = require('./datasetGenerator/dataset')
const intGen = require('./generators/intGenerator')

//
// Command-line argument parsing to get the path of the JSON Schema
//
const inputPathRegex = /-i=(.*)/g;
let schemaPath = ""
process.argv.forEach(function (val) {
    let m;

    while ((m = inputPathRegex.exec(val)) !== null) {
        if (m.index === inputPathRegex.lastIndex) {
            inputPathRegex.lastIndex++;
        }
        if (m.length > 1) {
            schemaPath = m[1]
        }
    }
});

//
// Put your generators here
//
typeModifiers = new Map([
    ["intGenerator", intGen]
])

// 
// Build the Dataset from the JSON Schema
//
let data = new dataset.Dataset(schemaPath, new dataset.TypeModifiers(typeModifiers))
data.buildGenerator
data.buildModel
data.buildDataset

//
// just to output the Dataset
//
data.outputDataset
