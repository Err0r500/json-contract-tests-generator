const gen = require('./_main')
const intGen = require('./intGenerator')


describe('Generator is an abstract class ... kind of : ', function () {
    test("it can't be intanciated", () => {
        expect(() => {
            new gen.Generator()
        }).toThrow();
    });

    class testClass extends gen.Generator {}
    testClass.prototype.generateInvalid = {}
    testClass.prototype.generateValid = {}
    testClass.prototype.optional = {}

    test("optionnal method can be removed", () => {
        delete testClass.prototype.optional
        expect(new testClass()).toEqual(expect.any(gen.Generator));
    });

    test("but not generateValid", () => {
        delete testClass.prototype.generateValid
        expect(() => {
            new testClass()
        }).toThrow();

        testClass.prototype.generateValid = {}
        expect(new testClass()).toEqual(expect.any(gen.Generator));
    });

    test("but not generateInvalid", () => {
        delete testClass.prototype.generateInvalid
        expect(() => {
            new testClass()
        }).toThrow();

        testClass.prototype.generateInvalid = {}
        expect(new testClass()).toEqual(expect.any(gen.Generator));
    });
});

describe('Transformer ', function () {
    test("needs a path", () => {
        expect(() => {
            new gen.Transformer('', [new intGen.IntWithMinConstrain(1)])
        }).toThrow();
    })

    test("needs an array of tranformers", () => {
        expect(() => {
            new gen.Transformer('path', 'hey')
        }).toThrow();
        expect(() => {
            new gen.Transformer('path', [])
        }).toThrow();
        expect(() => {
            new gen.Transformer('path', [{id: 1}])
        }).toThrow();
    })

    test("everything is fine", () => {
        expect(new gen.Transformer('path', [new intGen.IntWithMinConstrain(1)])).toEqual(expect.any(gen.Transformer));
    })
})