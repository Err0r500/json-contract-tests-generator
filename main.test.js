const intGen = require('./generators/intGenerator')
const mains = require('./main')
const h = require('./helpers')
var fs = require('fs');


const testValidPath = 'anyPath'

describe('genArray', function () {
    test('genArray throws an error if it receives an empty path', () => {
        expect(() => {
            mains.genArray('', 1)
        }).toThrow();
    });

    test('genArray calls genIntArray if receives an int', () => {
        intGen.generate = jest.fn();
        mains.genArray(testValidPath, 1234)
        expect(intGen.generate).toBeCalledWith(testValidPath, 1234);
    });
})

describe('traverse schema', function () {
    test('no recursion', () => {
        let parsed = mains.traverseObject(h.objectFromFile('testdata/00.json'), undefined, undefined, jest.fn())
        expect(parsed).toEqual({
            "id": "integer",
            "name": "string"
        });
    });

    test('1 level recursion', () => {
        parsed = mains.traverseObject(h.objectFromFile('testdata/01.json'), undefined, undefined, jest.fn())
        expect(parsed).toEqual({
            "id": "integer",
            "name": "string",
            "dimension":{
                "width":"integer",
            }
        });
    });
})