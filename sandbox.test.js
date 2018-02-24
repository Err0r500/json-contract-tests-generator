const infinite = require('lazy.js');

// should do the first to respect all the filters, then only the nth
// probleme with negative numbers !!!
// maybe better to take the max, and find the first multiple below (none specified ==> % 1)
function testConstrains(filters, max) {
    let genFunc
    max ? genFunc = (i) => i + 1 : genFunc = (i) => i - 1
    
    //reduce the filters then apply the resulting one to the infinite sequence
    let applyFilters = filters.reduce((acc, currCondition) => acc.filter((item) => currCondition(item)), infinite.generate(genFunc));

    return applyFilters.head()
}


test("sandbox", () => {
    let filters = [
        (int) => int > -18,
        (int) => int <= 1000,
        // (int) => int % 7 == 0,
    ]

    // expect(testConstrains(filters, false)).toEqual(21);
});