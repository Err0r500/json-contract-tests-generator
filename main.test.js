const intGen = require('./generators/intGenerator')
const mains = require('./main')


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