const dataset = require('./dataset')
const intGen = require('../generators/intGenerator')
const numberGen = require('../generators/numberGenerator')

const h = require('../helpers')

describe('Dataset constructor', function () {
    let schemaPath = "testdata/complex.json"
    let schema = h.objectFromFile(schemaPath)
    let fakeTypeMod = new dataset.TypeModifiers(new Map())

    test("must be constructed from a string", () => {
        expect(new dataset.Dataset(schemaPath, fakeTypeMod)).toEqual(expect.any(dataset.Dataset));
        expect(new dataset.Dataset(schema, fakeTypeMod)).toEqual(expect.any(dataset.Dataset));

        expect(() => {
            new dataset.Dataset(schema, 'ooops')
        }).toThrow();
        expect(() => {
            new dataset.Dataset(1, fakeTypeMod)
        }).toThrow();
    });
});

describe('run index like', function () {
    let schemaPath = "testdata/complex.json"

    typeModifiers = new Map()
    typeModifiers.set("intGenerator", intGen)
    typeModifiers.set("numberGenerator", numberGen)

    let data = new dataset.Dataset(schemaPath, new dataset.TypeModifiers(typeModifiers))
    data.buildGenerator
    data.buildModel
    data.buildDataset
    // data.outputDataset

    expect(data.dataset.valid.length).toBeGreaterThan(0);
    expect(data.dataset.invalid.length).toBeGreaterThan(0);
});



describe('genArray', function () {
    const testValidPath = 'anyPath'
    
    let modGen = new dataset.ModifierGenerator(
        new dataset.TypeModifiers(
            new Map([
                ['intGenerator', {generate: jest.fn()}],
                ['numberGenerator', {generate: jest.fn()}]
            ])
        )
    )

    test('genArray throws an error if it receives an empty path', () => {
        expect(() => {
            new dataset.ModifierGenerator()
        }).toThrow();
    });

    test('genArray throws an error if it receives an empty path', () => {
        expect(() => {
            modGen.generate('', 1)
        }).toThrow();
    });

    test('genArray throws an error if it receives an unknown type', () => {
        expect(() => {
            modGen.generate(testValidPath, {})
        }).toThrow();
    });

    test('genArray calls genIntArray if receives an object with type == integer', () => {
        let obj = {
            "type": "integer"
        }

        modGen.generate(testValidPath, obj)
        expect(modGen.typeModifiers.intGenerator.generate).toBeCalledWith(testValidPath, obj);
        
        obj = {
            "type": "number"
        }
        modGen.generate(testValidPath, obj)
        expect(modGen.typeModifiers.numberGenerator.generate).toBeCalledWith(testValidPath, obj);
        
    });
})


describe('traverse schema', function () {
    let fakeTypeMod = new dataset.TypeModifiers(new Map())
    let fakeModGenerator = {
        generate: jest.fn()
    }

    test('no recursion', () => {
        _dataset = new dataset.Dataset('testdata/00.json', fakeTypeMod)

        let parsed = _dataset.traverseSchema(_dataset.schema, undefined, undefined, fakeModGenerator)
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string"
            },
            "required_fields": []
        });
    });

    test('required fields, no recursion', () => {
        _dataset = new dataset.Dataset('testdata/03.json', fakeTypeMod)
        let parsed = _dataset.traverseSchema(_dataset.schema, undefined, undefined, fakeModGenerator)
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string"
            },
            "required_fields": [
                "id",
                "name",
                "price"
            ]
        });
    });

    test('1 level recursion', () => {
        _dataset = new dataset.Dataset('testdata/01.json', fakeTypeMod)

        let parsed = _dataset.traverseSchema(_dataset.schema, undefined, undefined, fakeModGenerator)
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string",
                "dimension": {
                    "width": "integer",
                }
            },
            "required_fields": []
        });
    });

    test('2 levels recursion', () => {
        _dataset = new dataset.Dataset('testdata/02.json', fakeTypeMod)
        let parsed = _dataset.traverseSchema(_dataset.schema, undefined, undefined, fakeModGenerator)
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string",
                "dimensions": {
                    "dimension": {
                        "width": "integer",
                    }
                }
            },
            "required_fields": []
        });
    });
})