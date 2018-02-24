const intGen = require('./generators/intGenerator')
const mains = require('./main')
const h = require('./helpers')
let fs = require('fs');


const testValidPath = 'anyPath' 

describe('genArray', function () {
    test('genArray throws an error if it receives an empty path', () => {
        expect(() => {
            mains.genArray('', 1)
        }).toThrow();
    });
    test('genArray throws an error if it receives an unknown type', () => {
        expect(() => {
            mains.genArray(testValidPath, {})
        }).toThrow();
    });

    test('genArray calls genIntArray if receives an object with type == integer', () => {
        intGen.generate = jest.fn();
        let obj =  {
            "type": "integer"
        }

        mains.genArray(testValidPath, obj)
        expect(intGen.generate).toBeCalledWith(testValidPath, obj);
    });
})

describe('traverse schema', function () {
    test('no recursion', () => {
        let parsed = mains.traverseObject(h.objectFromFile('testdata/00.json'), undefined, undefined, jest.fn())
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string"
            },
            "required_fields": []
        });
    });

    test('required fields, no recursion', () => {
        let parsed = mains.traverseObject(h.objectFromFile('testdata/03.json'), undefined, undefined, jest.fn())
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
        parsed = mains.traverseObject(h.objectFromFile('testdata/01.json'), undefined, undefined, jest.fn())
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
        parsed = mains.traverseObject(h.objectFromFile('testdata/02.json'), undefined, undefined, jest.fn())
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


describe('buildSet', function () {
    test('no recursion', () => {

        // mains.buildSet(h.objectFromFile('testdata/complex.json'))
       
     
    });
});