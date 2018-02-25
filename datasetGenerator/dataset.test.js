const dataset = require('./dataset')
const h = require('../helpers')

describe('Dataset constructor', function () {
    test("must be constructed from a string", () => {
        let schemaPath = "testdata/complex.json"
        let schema = h.objectFromFile(schemaPath)

        expect(new dataset.Dataset(schemaPath)).toEqual(expect.any(dataset.Dataset));
        expect(new dataset.Dataset(schema)).toEqual(expect.any(dataset.Dataset));

        expect(() => {
            new dataset.Dataset(1)
        }).toThrow();

        let data = new dataset.Dataset(schema)
        data.buildGenerator
        data.buildModel
        data.buildDataset
        data.outputDataset     

        expect(data.dataset.invalid.length).toBeGreaterThan(1);
        expect(data.dataset.valid.length).toBeGreaterThan(1);
    });
});



describe('genArray', function () {
    const testValidPath = 'anyPath'
    
    let fakeModGenerator = {
        generate: jest.fn()
    }

    let modGen = new dataset.ModifierGenerator({intGenerator:fakeModGenerator})

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
        expect(fakeModGenerator.generate).toBeCalledWith(testValidPath, obj);
    });
})


describe('traverse schema', function () {
    let fakeModGenerator = {
        generate: jest.fn()
    }
    test('no recursion', () => {
        _dataset = new dataset.Dataset('testdata/00.json')

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
        _dataset = new dataset.Dataset('testdata/03.json')
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
        _dataset = new dataset.Dataset('testdata/01.json')

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
        _dataset = new dataset.Dataset('testdata/02.json')
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