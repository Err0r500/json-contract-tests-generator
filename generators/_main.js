class Generator {
    constructor() {
        if (new.target === Generator) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if ('generateValid' in this === false) {
            throw new TypeError("Must override method generateValid");
        }
        if ('generateInvalid' in this === false) {
            throw new TypeError("Must override method generateInvalid");
        }
    }

    isGenerator() {
        return true
    }
}

class Transformer {
    constructor(path, functionsToApply) {
        if (path == '') {
            throw new TypeError("a Tranformer needs a path");
        }
        
        if (!Array.isArray(functionsToApply)) {
            throw new TypeError("a Tranformer needs an array of functionsToApply");
        }
        
        if (functionsToApply.length == 0) {
            throw new TypeError("a Tranformer needs a non empty array of functionsToApply");
        }

        if (typeof(functionsToApply[0].isGenerator) === 'undefined' || !functionsToApply[0].isGenerator()) {
            throw new TypeError("a Tranformer needs an array of functions for functionsToApply");
        }

        this.path = path;
        this.functionsToApply = functionsToApply;
    }
}

module.exports = {
    Generator,
    Transformer
};