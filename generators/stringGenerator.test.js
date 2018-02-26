const stringGen = require('./stringGenerator')

describe('generate test values', function () {
    let obj = {
        test: stringGen.genRandomString(100)
    }
    console.log(obj.test)
    test("valid set", () => {
        expect(JSON.parse(JSON.stringify(obj)).test.length).toEqual(100)
        expect(JSON.parse(JSON.stringify(obj)).test).toEqual(obj.test)

        // just to be sure special chars is not a problem
        for (let index = 0; index < 34; index++) {
            obj.test = String.fromCharCode(index)
            expect(JSON.parse(JSON.stringify(obj)).test).toEqual(String.fromCharCode(index))
        }
    })

})