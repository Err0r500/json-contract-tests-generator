
setNested = (theObject, path, funcToApply) => {
    try {
        separator = '.';
        path.
        replace('[', separator).replace(']', '').
        split(separator).
        reduce(
            function (obj, property, index, array) {
                if (index == array.length - 1) { 
                    obj[property] = funcToApply();
                } 
                return obj[property]
            }, theObject
        );
    } catch (err) {
        return undefined;
    }
    return theObject
}

module.exports = {
    setNested
};