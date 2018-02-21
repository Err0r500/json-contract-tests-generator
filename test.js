var fs = require('fs');

var contents = fs.readFileSync('testdata/simple.json');

const buildCustomType = (obj) => {
    // console.log("generate >> ", obj["type"], obj)
}

const traverseObject = (obj) => {
    var tmp = {}
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
            tmp = traverseObject(obj[key]) // recurse on root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverseObject(obj[key]["properties"]) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            tmp[key] = obj[key]["type"];
        }
    });
    return tmp
};

var final = traverseObject(JSON.parse(contents))

console.log(final)
// fs.writeFile("/tmp/test", JSON.stringify(final), function (err) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// });