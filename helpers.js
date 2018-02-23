let fs = require('fs');

const objectFromFile = (jsonSchemaPath) => {
    let contents = fs.readFileSync(jsonSchemaPath);
    return JSON.parse(contents)
}

module.exports = {
    objectFromFile,
} 