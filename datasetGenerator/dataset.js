const h = require('../helpers')
const gen = require('../generators/_main')
const intGen = require('../generators/intGenerator')
const object = require('./object')

class Dataset {
    constructor(schema) {
        this.modifiers = []
        if (typeof schema == 'string') {
            this.generator = object.traverse(h.objectFromFile(schema), '', this.modifiers, genArray)
        } else if (typeof schema == 'object') {
            this.generator = object.traverse(schema, '', this.modifiers, genArray)
        } else {
            throw new TypeError("Dataset failed");
        }

        this.firstValidKeys = new Map();
        this.dataset = {}
        this.dataset.valid = new Array();
        this.dataset.invalid = new Array();
    }

    get buildModel() {
        this.modifiers.map(
            (mod) => mod.functionsToApply.map(
                (e) => {
                    if (!this.firstValidKeys.has(mod.path)) {
                        object.setProperty(this.generator, 'model' + mod.path, e.generateValid)
                        this.firstValidKeys.set(mod.path, e.generateValid)
                    }
                }
            )
        )
    }

    get buildDataset() {
        this.dataset.valid.push(this.generator.model)

        // base model filter values upon value already in model
        this.modifiers
            .map(mod => mod.functionsToApply
                .filter((e) => this.firstValidKeys.get(mod.path) !== e.generateValid) // already applied in the base model
                .map((e) => {
                    let tmp = {}
                    tmp.model = JSON.parse(JSON.stringify(this.generator.model));
                    object.setProperty(tmp, 'model' + mod.path, e.generateValid)
                    this.dataset.valid.push(tmp.model)
                })
            )

        this.modifiers
            .map(mod => mod.functionsToApply
                .filter((e) => typeof e.generateInvalid != 'undefined') // not relevant invalid return undefined
                .map((e) => {
                    let tmp = {}
                    tmp.model = JSON.parse(JSON.stringify(this.generator.model));
                    object.setProperty(tmp, 'model' + mod.path, e.generateInvalid)
                    this.dataset.invalid.push(tmp.model)
                })
            )
    }

    get log() {
        console.log(JSON.stringify(this, null, 50))
    }

    get outputDataset() {
        console.log(JSON.stringify(this.dataset, null, 2))
    }
}

const genArray = (currentPath, obj) => {
    if (currentPath == '') {
        throw new TypeError("genArray received an empty string as path");
    }

    switch (obj.type) {
        case "integer":
            return intGen.generate(currentPath, obj)

        default:
            throw new TypeError("genArray unknown type" + typeof obj)

    }
}

module.exports = {
    Dataset,
    genArray
};