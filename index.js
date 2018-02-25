const h = require('./helpers')
const dataset = require('./datasetGenerator/dataset')

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
let schema = h.objectFromFile(schemaPath)
let data = new dataset.Dataset(schema)
data.buildModel
data.buildDataset
data.outputDataset