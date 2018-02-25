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
let data = new dataset.Dataset(schemaPath)
data.buildGenerator
data.buildModel
data.buildDataset
data.outputDataset