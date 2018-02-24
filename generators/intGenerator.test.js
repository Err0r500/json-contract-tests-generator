const gen = require('./_main')
const intGen = require('./intGenerator')

// todo remove duplicates on multiple of
describe('generate test values', function () {
    test("valid set", () => {
        let path = 'age'

        let t = intGen.generate(path, {
            minimum: -5,
            maximum: 15,
        })
        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([-5, 15]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(2);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-6, 16]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(2);

        t = intGen.generate(path, {
            minimum: -5,
            maximum: 15,
            exclusiveMinimum: true,
            exclusiveMaximum: true
        })
        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([-4, 14]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(2);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-5, 15]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(2);


        t = intGen.generate(path, {
            minimum: -5,
            maximum: 15,
            multipleOf: 7
        })
        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([7, 14, 7]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(3);
        
        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-7, 21, 8]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(3);

        t = intGen.generate(path, {
            minimum: -14,
            maximum: 21,
            multipleOf: 7,
            exclusiveMinimum: true,
            exclusiveMaximum: true
        })
        expect(t.functionsToApply.map(e => e.generateValid)).toEqual(expect.arrayContaining([-7, 14, -7]))
        expect(t.functionsToApply.map(e => e.generateValid)).toHaveLength(3);

        expect(t.functionsToApply.map(e => e.generateInvalid)).toEqual(expect.arrayContaining([-14, 21, -6]))
        expect(t.functionsToApply.map(e => e.generateInvalid)).toHaveLength(3);
    });
});


describe('_Int constructor', function () {
    test("must be constructed from an int", () => {
        expect(new intGen._Int(1)).toEqual(expect.any(intGen._Int));

        expect(() => {
            new intGen._Int('blabl')
        }).toThrow();
        expect(() => {
            new intGen._Int(12, 0)
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
        expect(new intGen.IntWithMinConstrain({minimum:1})).toEqual(expect.any(gen.Generator));

        expect(() => {
            new intGen.IntWithMaxConstrain('blabl')
        }).toThrow();
        expect(new intGen.IntWithMaxConstrain({maximum:1})).toEqual(expect.any(gen.Generator));
    });
});

describe('intMinGenerator', function () {
    test("must return an int", () => {
        let tmp = new intGen.IntWithMinConstrain({minimum:10})
        expect(tmp.generateValid).toEqual(10);
        expect(tmp.generateInvalid).toEqual(9);
    });

    test("with exclusive min", () => {
        let tmp = new intGen.IntWithMinConstrain({minimum:10, exclusiveMinimum:true})
        expect(tmp.generateValid).toEqual(11);
        expect(tmp.generateInvalid).toEqual(10);
    });

    test("with exclusive min == 0", () => {
        let tmp = new intGen.IntWithMinConstrain({minimum:0})
        expect(tmp.generateValid).toEqual(0); 
        expect(tmp.generateInvalid).toEqual(-1);

        tmp = new intGen.IntWithMinConstrain({minimum:0, exclusiveMinimum:true})
        expect(tmp.generateValid).toEqual(1); 
        expect(tmp.generateInvalid).toEqual(0);
    });

    test("with MIN_SAFE_INTEGER", () => {
        let tmp = new intGen.IntWithMinConstrain({minimum:Number.MIN_SAFE_INTEGER})
        expect(tmp.generateValid).toEqual(Number.MIN_SAFE_INTEGER); 
        expect(tmp.generateInvalid).toEqual(undefined);
    });
});

describe('intMaxGenerator', function () {
    test("must return an int", () => {
        let tmp = new intGen.IntWithMaxConstrain({maximum:10})
        expect(tmp.generateInvalid).toEqual(expect.any(Number));
        expect(tmp.generateValid).toEqual(expect.any(Number));
    });

    test("with exclusive max == 0", () => {
        let tmp = new intGen.IntWithMaxConstrain({maximum:0})
        expect(tmp.generateValid).toEqual(0); 
        expect(tmp.generateInvalid).toEqual(1);
    });

    test("with MAX_SAFE_INTEGER", () => {
        let tmp = new intGen.IntWithMaxConstrain({maximum:Number.MAX_SAFE_INTEGER})
        expect(tmp.generateValid).toEqual(Number.MAX_SAFE_INTEGER); 
        expect(tmp.generateInvalid).toEqual(undefined);
    });
});


describe('intGenerator', function () {
    test("must be constructed from an int", () => {
        let path = 'age'
        expect(intGen.generate(path, {})).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {
            minimum: 10
        })).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {
            maximum: 10
        })).toEqual(expect.any(gen.Transformer));
        expect(intGen.generate(path, {
            minimum: 10,
            maximum: 10
        })).toEqual(expect.any(gen.Transformer));

    });
});



test("getClosestMultiple", () => {
    expect(intGen.getClosestMultiple(10)).toEqual(10);
    expect(intGen.getClosestMultiple(10, 8)).toEqual(16);
    expect(intGen.getClosestMultiple(-10, 8)).toEqual(-8);
    expect(intGen.getClosestMultiple(10, 8, intGen.dirEnum.down)).toEqual(8);
    expect(intGen.getClosestMultiple(-10, 8, intGen.dirEnum.down)).toEqual(-16);
})