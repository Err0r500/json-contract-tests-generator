nested = require('../nested');

describe('getNested', function () {
    it('get simple nesting', function () {
        expect('foo').toEqual(nested.getNested({
            id: "foo"
        }, 'id'))
    });
});

describe('setNested', function () {
    it('set simple nesting', function () {
        var initial = {
            name: "matth",
            id: "foo"
        }
        var expected = {
            id: "bar",
            name: "matth"
        }
        expect(expected).toEqual(nested.setNested(initial, 'id', function () {
            return 'bar'
        }))
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

        expect(expected).toEqual(nested.setNested(initial, 'identities.names[1].lastname', function () {
            return 'jacquot'
        }))
    });
});