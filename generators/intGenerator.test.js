const gen = require('./_main')
const intGen = require('./intGenerator')

describe('_Int constructor', function () {
    test("must be constructed from an int", () => {
        expect(new intGen._Int(1)).toEqual(expect.any(intGen._Int));
        
        expect(() => {
            new intGen._Int('blabl')
        }).toThrow();

        expect(() => {
            new intGen._Int(12).generateInvalid
        }).toThrow();
        expect(() => {
            new intGen._Int(12).generateValid
        }).toThrow();

    });
});

describe('IntWith (Min/Max) Constrain Generator', function () {
    test("must be constructed from an int", () => {
        expect(() => {
            new intGen.IntWithMinConstrain('blabl')
        }).toThrow();
        expect(new intGen.IntWithMinConstrain(1)).toEqual(expect.any(gen.Generator));

        expect(() => {
            new intGen.IntWithMaxConstrain('blabl')
        }).toThrow();
        expect(new intGen.IntWithMaxConstrain(1)).toEqual(expect.any(gen.Generator));
    });
});

describe('intMinGenerator', function () {
    test("must return an int", () => {
        let tmp = new intGen.IntWithMinConstrain(10)
        expect(tmp.generateInvalid).toEqual(expect.any(Number));
        expect(tmp.generateValid).toEqual(expect.any(Number));
    });
});

describe('intMaxGenerator', function () {
    test("must return an int", () => {
        let tmp = new intGen.IntWithMaxConstrain(10)
        expect(tmp.generateInvalid).toEqual(expect.any(Number));
        expect(tmp.generateValid).toEqual(expect.any(Number));
    });
});


describe('intGenerator', function () {
    test("must be constructed from an int", () => {
        let path = 'age'
        expect(intGen.generate(path, {})).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {minimum:10})).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {maximum:10})).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {minimum:10, maximum:10})).toEqual(expect.any(gen.Transformer));
    });
});