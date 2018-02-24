
// functoApply can be : 
// - the new value 
// - a function that returns the new value

const objectPropertySetter = (theObject, path, funcToApply) => {
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
    objectPropertySetter
};