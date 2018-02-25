const dataset = require('./datasetGenerator/dataset')
const intGen = require('./generators/intGenerator')

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


// TODO : loop if input path is folder
// handle path with quotes

typeModifiers = new Map()
typeModifiers.set("intGenerator", intGen)

let data = new dataset.Dataset(schemaPath, new dataset.TypeModifiers(typeModifiers))
data.buildGenerator
data.buildModel
data.buildDataset
data.outputDataset