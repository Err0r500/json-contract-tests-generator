var fs = require('fs');

const objectFromFile = (jsonSchemaPath) => {
    var contents = fs.readFileSync(jsonSchemaPath);
    return JSON.parse(contents)
}

module.exports = {
    objectFromFile,
} 