setter = require('./propertySetter');

describe('setNested', function () {
    it('throws an error if the path is not found in the object', function () {
        let initial = {
            name: "matth",
            id: "foo"
        }

        expect(() => {
            setter.objectPropertySetter(initial, 'pathNotFound', () => {})
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

        expect(expected).toEqual(setter.objectPropertySetter(initial, 'id',  () => 'bar'))        
        expect(expected).toEqual(setter.objectPropertySetter(initial, 'id', 'bar'))      
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

        expect(expected).toEqual(setter.objectPropertySetter(initial, 'identities.names[1].lastname', function () {
            return 'jacquot'
        }))
    });
});