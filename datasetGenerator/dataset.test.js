const dataset = require('./dataset')
const h = require('../helpers')
let fs = require('fs');

const object = require('./object')

const gen = require('../generators/_main')
const intGen = require('../generators/intGenerator')


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
        data.buildModel
        data.buildDataset
        data.outputDataset
    });
});


const testValidPath = 'anyPath' 

describe('genArray', function () {
    test('genArray throws an error if it receives an empty path', () => {
        expect(() => {
            dataset.genArray('', 1)
        }).toThrow();
    });
    test('genArray throws an error if it receives an unknown type', () => {
        expect(() => {
            dataset.genArray(testValidPath, {})
        }).toThrow();
    });

    test('genArray calls genIntArray if receives an object with type == integer', () => {
        intGen.generate = jest.fn();
        let obj =  {
            "type": "integer"
        }

        dataset.genArray(testValidPath, obj)
        expect(intGen.generate).toBeCalledWith(testValidPath, obj);
    });
})