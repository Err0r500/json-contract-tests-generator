const h = require('../helpers')
const gen = require('../generators/_main')
const object = require('./object')

const currentlyHandledTypes = [
    'integer'
]

class TypeModifiers {
    constructor(mapOfModifiers) {
        this.intGenerator = mapOfModifiers.get('intGenerator')
    }
}

class Dataset {
    constructor(schema, typeModifiers) {
        if (typeof typeModifiers === 'undefined' || !(typeModifiers instanceof TypeModifiers)) {
            throw new TypeError("tried to instanciate a Dataset without an instance TypeModifiers");
        }
        this.typeModifiers = typeModifiers

        if (typeof schema == 'string') {
            this.schema = h.objectFromFile(schema)
        } else if (typeof schema == 'object') {
            this.schema = schema
        } else {
            throw new TypeError("Dataset failed");
        }


        this.modifiers = []
        this.firstValidKeys = new Map();
        this.dataset = {
            valid: new Array(),
            invalid: new Array(),
        }
    }

    get buildGenerator() {
        this.generator = this.traverseSchema(this.schema, '', this.modifiers, new ModifierGenerator(this.typeModifiers))
    }

    traverseSchema(obj, currentPath = '', arrayToOutput = [], modifierGenerator) {
        let tmp = {}
        let tmpPath = currentPath

        Object.keys(obj).forEach(key => {
            if (key == "properties") { // obj is the object root otherwise the recursion would have been called on obj[key]["properties"] (below)
                tmp.required_fields = []
                tmp.model = this.traverseSchema(obj[key], currentPath, arrayToOutput, modifierGenerator)
            } else if (key == "required") {
                tmp.required_fields = obj[key] // add required fields to root object
            } else if (obj[key]["properties"]) {
                tmp[key] = this.traverseSchema(obj[key]["properties"], tmpPath += '.' + key, arrayToOutput, modifierGenerator) // recurse on next level object
            } else if (typeof obj[key] == 'object') {
                tmp[key] = obj[key]["type"]; // for the model

                if (currentlyHandledTypes.includes(obj[key]["type"])) {
                    arrayToOutput.push(modifierGenerator.generate(currentPath + '.' + key, obj[key])) // for the transformers
                }
            }
        });
        return tmp
    };

    // build model generates a valid model and adds the applied keys to firstValidKeys
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
                .filter((e) => typeof e.generateInvalid != 'undefined') // not relevant generateInvalid return undefined
                .map((e) => {
                    let tmp = {}
                    tmp.model = JSON.parse(JSON.stringify(this.generator.model));
                    object.setProperty(tmp, 'model' + mod.path, e.generateInvalid)
                    this.dataset.invalid.push(tmp.model)
                })
            )
    }

    get outputDataset() {
        console.log(JSON.stringify(this.dataset, null, 2))
    }
}


class ModifierGenerator {
    constructor(typeModifiers) {
        if (!(typeModifiers instanceof TypeModifiers)) {
            throw new TypeError("tried to instanciated a modifiergenerator without an instance TypeModifiers");
        }
        this.intGenerator = typeModifiers.intGenerator
    }

    generate(currentPath, obj) {
        if (currentPath == '') {
            throw new TypeError("genArray received an empty string as path");
        }

        switch (obj.type) {
            case "integer":
                return this.intGenerator.generate(currentPath, obj)

            default:
                throw new TypeError("genArray unknown type" + typeof obj)
        }
    }
}

module.exports = {
    Dataset,
    TypeModifiers,
    ModifierGenerator
};