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
}

module.exports = {
    Generator,
};