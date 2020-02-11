// Checks if the author has a middle name
function testMiddleName(str) {
    let regexpTest = /(.*)\s(.\.)(.\.)/
    let test = regexpTest.test(str)
    return test
}

// Replaces the first name and middle name of the author with the initials 
function initials(str) {
    return str.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w + ' ').join('');
}

exports.testMiddleName = testMiddleName;
exports.initials = initials;