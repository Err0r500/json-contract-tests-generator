setNested = (theObject, path, funcToApply) => {
    separator = '.';
    path.
    replace('[', separator).replace(']', '').
    split(separator).
    reduce(
         (obj, property, index, array) => {
            if (index == array.length - 1) { // end of the recursion
                if (typeof obj[property] === 'undefined') {
                    throw new TypeError("nothing found at path " + path)
                } else {
                    obj[property] = funcToApply();
                }
            }
            return obj[property]
        }, theObject
    );
    return theObject
}

module.exports = {
    setNested
};