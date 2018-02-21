var fs = require('fs');

var contents = fs.readFileSync('testdata/simple.json');

const buildCustomType = (obj) => {
    // console.log("generate >> ", obj["type"], obj)
}

const traverseObject = (obj) => {
    var tmp = {}
    Object.keys(obj).forEach(key => {
        if (key == "properties") {
           console.log('>>', key)
           tmp[key] = traverseObject(obj[key])
        }
        else if (typeof obj[key] == 'object') {
            if (obj[key]["type"] == "array") {
                tmp[key] = [obj[key]["items"]["type"]]
            } else {
                buildCustomType(obj[key])
                tmp[key] = obj[key]["type"];
            }
        }
    });
    return tmp
};

var final = traverseObject(JSON.parse(contents), final)

console.log(final)
// fs.writeFile("/tmp/test", JSON.stringify(final), function (err) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 