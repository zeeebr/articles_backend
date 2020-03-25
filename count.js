const {
    PaperS,
    PaperW,
    NewEidS,
    NewEidW
} = require('./db');
const paperS = new PaperS();
const paperW = new PaperW();
const newEidS = new NewEidS();
const newEidW = new NewEidW();

async function main() {
    let count15w = await paperW.count('2015');
    let count16w = await paperW.count('2016');
    let count17w = await paperW.count('2017');
    let count18w = await paperW.count('2018');
    let count19w = await paperW.count('2019');
    let count20w = await paperW.count('2020');

    let count15wP = await newEidW.count('2015');
    let count16wP = await newEidW.count('2016');
    let count17wP = await newEidW.count('2017');
    let count18wP = await newEidW.count('2018');
    let count19wP = await newEidW.count('2019');
    let count20wP = await newEidW.count('2020');

    let count15s = await paperS.count('2015');
    let count16s = await paperS.count('2016');
    let count17s = await paperS.count('2017');
    let count18s = await paperS.count('2018');
    let count19s = await paperS.count('2019');
    let count20s = await paperS.count('2020');

    let count15sP = await newEidS.count('2015');
    let count16sP = await newEidS.count('2016');
    let count17sP = await newEidS.count('2017');
    let count18sP = await newEidS.count('2018');
    let count19sP = await newEidS.count('2019');
    let count20sP = await newEidS.count('2020');

    let countTable = {
        wos: {
            '2015': count15w,
            '2016': count16w,
            '2017': count17w,
            '2018': count18w,
            '2019': count19w,
            '2020': count20w,
            '2015+': count15wP,
            '2016+': count16wP,
            '2017+': count17wP,
            '2018+': count18wP,
            '2019+': count19wP,
            '2020+': count20wP,
            all: count15w + count16w + count17w + count18w + count19w + count20w
        },
        scopus: {
            '2015': count15s,
            '2015+': count15sP,
            '2016': count16s,
            '2017': count17s,
            '2018': count18s,
            '2019': count19s,
            '2020': count20s,
            '2015+': count15sP,
            '2016+': count16sP,
            '2017+': count17sP,
            '2018+': count18sP,
            '2019+': count19sP,
            '2020+': count20sP,
            'all': count15s + count16s + count17s + count18s + count19s + count20s
        },
        all: {
            '2015': count15s + count15w,
            '2016': count16s + count16w,
            '2017': count17s + count17w,
            '2018': count18s + count18w,
            '2019': count19s + count19w,
            '2020': count20s + count20w,
            'all': count15s + count16s + count17s + count18s + count19s + count20s + count15w + count16w + count17w + count18w + count19w + count20w
        }
    };

    //console.table(countTable);
    return countTable;
}

module.exports = main;