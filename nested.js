var exports = module.exports = {};

exports.getNested = (theObject, path) => {
    try {
        separator = '.';

        return path.
        replace('[', separator).replace(']', '').
        split(separator).
        reduce(
            function (obj, property) {
                return obj[property];
            }, theObject
        );

    } catch (err) {
        return undefined;
    }
}

exports.setNested = (theObject, path, funcToApply) => {
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