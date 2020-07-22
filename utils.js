// Finds the maximum number in an array
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

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

function uniqueArr(arr) {
    let test = new Set()
    let unique = []

    for (let i = 0; i < arr.length; i++) {
        if (!test.has(JSON.stringify(arr[i]))) {
        test.add(JSON.stringify(arr[i]))
        unique.push(arr[i])
        } else {
            console.log('error :', arr[i])
        }
    }

    return unique;
}

exports.getMaxOfArray = getMaxOfArray;
exports.testMiddleName = testMiddleName;
exports.initials = initials;
exports.uniqueArr = uniqueArr;