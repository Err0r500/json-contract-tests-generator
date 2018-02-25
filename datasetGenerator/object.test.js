object = require('./object');
const h = require('../helpers')

describe('setNested', function () {
    it('throws an error if the path is not found in the object', function () {
        let initial = {
            name: "matth",
            id: "foo"
        }

        expect(() => {
            object.setProperty(initial, 'pathNotFound', () => {})
        }).toThrow();
    });

    it('set simple nesting', function () {
        let initial = {
            name: "matth",
            id: "foo"
        }
        let expected = {
            id: "bar",
            name: "matth"
        }

        expect(expected).toEqual(object.setProperty(initial, 'id',  () => 'bar'))        
        expect(expected).toEqual(object.setProperty(initial, 'id', 'bar'))      
    });

    it('set complex nesting', function () {
        initial = {
            id: "bar",
            identities: {
                ages: 13,
                names: [{
                    firstname: "foo",
                    lastname: "bar"
                }, {
                    firstname: "matth",
                    lastname: "j"
                }]
            }
        }
        expected = {
            id: "bar",
            identities: {
                ages: 13,
                names: [{
                    firstname: "foo",
                    lastname: "bar"
                }, {
                    firstname: "matth",
                    lastname: "jacquot" // changed value
                }]
            }
        }

        expect(expected).toEqual(object.setProperty(initial, 'identities.names[1].lastname', function () {
            return 'jacquot'
        }))
    });
});

describe('traverse schema', function () {
    test('no recursion', () => {
        let parsed = object.traverse(h.objectFromFile('testdata/00.json'), undefined, undefined, jest.fn())
        expect(parsed).toEqual({
            "model": {
                "id": "integer",
                "name": "string"
            },
            "required_fields": []
        });
    });

    test('required fields, no recursion', () => {
        let parsed = object.traverse(h.objectFromFile('testdata/03.json'), undefined, undefined, jest.fn())
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
        parsed = object.traverse(h.objectFromFile('testdata/01.json'), undefined, undefined, jest.fn())
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
        parsed = object.traverse(h.objectFromFile('testdata/02.json'), undefined, undefined, jest.fn())
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
