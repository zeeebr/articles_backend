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

/**
 * @param {string} s1 Исходная строка
 * @param {string} s2 Сравниваемая строка
 * @param {object} [costs] Веса операций { [replace], [replaceCase], [insert], [remove] }
 * @return {number} Расстояние Левенштейна
 */

function levenshtein(s1, s2, costs) {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;

    cutHalf = flip = Math.max(l1, l2);

    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array((cutHalf * 2) - 1);

    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return Math.round((s1.length - (buf[l2 + cutHalf - flip])) / s1.length * 100);
}

exports.getMaxOfArray = getMaxOfArray;
exports.testMiddleName = testMiddleName;
exports.initials = initials;
exports.levenshtein = levenshtein;