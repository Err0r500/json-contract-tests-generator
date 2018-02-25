const currentlyHandledTypes = [
    'integer'
]

const traverse = (obj, currentPath = '', arrayToOutput = [], Cb) => {
    let tmp = {}
    let tmpPath = currentPath

    Object.keys(obj).forEach(key => {
        if (key == "properties") { // obj is the object root otherwise the recursion would have been called on obj[key]["properties"] (below)
            tmp.required_fields = []
            tmp.model = traverse(obj[key], currentPath, arrayToOutput, Cb)
        } else if (key == "required") {
            tmp.required_fields = obj[key] // add required fields to root object
        } else if (obj[key]["properties"]) {
            tmp[key] = traverse(obj[key]["properties"], tmpPath += '.' + key, arrayToOutput, Cb) // recurse on next level object
        } else if (typeof obj[key] == 'object') {
            tmp[key] = obj[key]["type"]; // for the model
            
            if (currentlyHandledTypes.includes(obj[key]["type"])) {
                arrayToOutput.push(Cb(currentPath + '.' + key, obj[key])) // for the transformers
            }
        }
    });
    return tmp
};


// functoApply can be : 
// - the new value 
// - a function that returns the new value
const setProperty = (theObject, path, funcToApply) => {
    separator = '.';

    path
        .replace('[', separator).replace(']', '')
        .split(separator)
        .reduce(
            (obj, property, index, array) => {
                if (index == array.length - 1) { // end of the recursion
                    if (typeof obj[property] === 'undefined') {
                        throw new TypeError("nothing found at path " + path)
                    } else {
                        typeof funcToApply == 'function' ? obj[property] = funcToApply() : obj[property] = funcToApply;
                    }
                }
                return obj[property] 
            }, theObject
        );
    return theObject
}


module.exports = {
    traverse,
    setProperty
};