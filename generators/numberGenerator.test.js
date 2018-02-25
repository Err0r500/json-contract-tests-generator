const gen = require('./_main')
const floatGen = require('./numberGenerator')

describe('generate test values', function () {
    test("valid set", () => {
        let path = 'age'

        let t = floatGen.generate(path, {})

        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([Number.MIN_VALUE, Number.MAX_VALUE]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(2);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([undefined, undefined]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(2);
    })

    test("valid set", () => {
        let path = 'age'

        let t = floatGen.generate(path, {
            minimum: -13.5,
            maximum: 12.8,
        })

        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([-13.5, 12.8]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(2);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-13.5 - floatGen.EPSILON, 12.8 + floatGen.EPSILON]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(2);

        t = floatGen.generate(path, {
            minimum: -5,
            maximum: 15,
            exclusiveMinimum: true,
            exclusiveMaximum: true
        })
        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([-5 + floatGen.EPSILON, 15 - floatGen.EPSILON]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(2);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-5, 15]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(2);
    });
});


describe('_Float constructor', function () {
    test("must be constructed from an int", () => {
        expect(new floatGen._Float(1)).toEqual(expect.any(floatGen._Float));

        expect(() => {
            new floatGen._Float('blabl')
        }).toThrow();

        expect(() => {
            new floatGen._Float(Number.POSITIVE_INFINITY)
        }).toThrow();

        expect(() => {
            new floatGen._Float(12).generateInvalid
        }).toThrow();
        expect(() => {
            new floatGen._Float(12).generateValid
        }).toThrow();

    });
});

describe('IntWith (Min/Max) Constrain Generator', function () {
    test("must be constructed from an int", () => {
        expect(() => {
            new floatGen.withMinConstrain('blabl')
        }).toThrow();
        expect(new floatGen.withMinConstrain({
            minimum: 1
        })).toEqual(expect.any(gen.Generator));

        expect(() => {
            new floatGen.withMinConstrain('blabl')
        }).toThrow();
        expect(new floatGen.withMaxConstrain({
            maximum: 1
        })).toEqual(expect.any(gen.Generator));
    });
});

describe('intMinGenerator', function () {
    test("must return an int", () => {
        let tmp = new floatGen.withMinConstrain({
            minimum: 10
        })
        expect(tmp.generateValid).toEqual(10);
        expect(tmp.generateInvalid).toEqual(10 - floatGen.EPSILON);
    });

    test("with exclusive min", () => {
        let tmp = new floatGen.withMinConstrain({
            minimum: 10,
            exclusiveMinimum: true
        })
        expect(tmp.generateValid).toEqual(10 + floatGen.EPSILON);
        expect(tmp.generateInvalid).toEqual(10);
    });

    test("with exclusive min == 0", () => {
        let tmp = new floatGen.withMinConstrain({
            minimum: 0
        })
        expect(tmp.generateValid).toEqual(0);
        expect(tmp.generateInvalid).toEqual(-floatGen.EPSILON);

        tmp = new floatGen.withMinConstrain({
            minimum: 0,
            exclusiveMinimum: true
        })
        expect(tmp.generateValid).toEqual(floatGen.EPSILON);
        expect(tmp.generateInvalid).toEqual(0);
    });

    test("with MIN_SAFE_FloatEGER", () => {
        let tmp = new floatGen.withMinConstrain({
            minimum: Number.MIN_VALUE
        })
        expect(tmp.generateValid).toEqual(Number.MIN_VALUE);
        expect(tmp.generateInvalid).toEqual(undefined);
    });
});

describe('intMaxGenerator', function () {
    test("must return an int", () => {
        let tmp = new floatGen.withMaxConstrain({
            maximum: 10
        })
        expect(tmp.generateInvalid).toEqual(expect.any(Number));
        expect(tmp.generateValid).toEqual(expect.any(Number));
    });

    test("with exclusive max == 0", () => {
        let tmp = new floatGen.withMaxConstrain({
            maximum: 0
        })
        expect(tmp.generateValid).toEqual(0);
        expect(tmp.generateInvalid).toEqual(floatGen.EPSILON);
    });

    test("with MAX_SAFE_FloatEGER", () => {
        let tmp = new floatGen.withMaxConstrain({
            maximum: Number.MAX_VALUE
        })
        expect(tmp.generateValid).toEqual(Number.MAX_VALUE);
        expect(tmp.generateInvalid).toEqual(undefined);
    });
});


describe('floatGenerator', function () {
    test("must be constructed from an int", () => {
        let path = 'age'
        expect(floatGen.generate(path, {})).toEqual(expect.any(gen.Transformer));
        expect(floatGen.generate(path, {
            minimum: 10
        })).toEqual(expect.any(gen.Transformer));
        expect(floatGen.generate(path, {
            maximum: 10
        })).toEqual(expect.any(gen.Transformer));
        expect(floatGen.generate(path, {
            minimum: 10,
            maximum: 10
        })).toEqual(expect.any(gen.Transformer));

    });
});



// test("getClosestMultiple", () => {
//     expect(floatGen.getClosestMultiple(10)).toEqual(10);
//     expect(floatGen.getClosestMultiple(10, 8)).toEqual(16);
//     expect(floatGen.getClosestMultiple(-10, 8)).toEqual(-8);
//     expect(floatGen.getClosestMultiple(10, 8, floatGen.dirEnum.down)).toEqual(8);
//     expect(floatGen.getClosestMultiple(-10, 8, floatGen.dirEnum.down)).toEqual(-16);
// })