const {
    PaperS,
    PaperW,
    Author,
    Connection
} = require('./db');
const paperS = new PaperS();
const paperW = new PaperW();
const log = console.log;

async function main() {
    let count15w = await paperW.count('2015');
    let count16w = await paperW.count('2016');
    let count17w = await paperW.count('2017');
    let count18w = await paperW.count('2018');
    let count19w = await paperW.count('2019');
    let count20w = await paperW.count('2020');

    let count15s = await paperS.count('2015');
    let count16s = await paperS.count('2016');
    let count17s = await paperS.count('2017');
    let count18s = await paperS.count('2018');
    let count19s = await paperS.count('2019');
    let count20s = await paperS.count('2020');

    let countTable = {
        wos: {
            2015: count15w,
            2016: count16w,
            2017: count17w,
            2018: count18w,
            2019: count19w,
            2020: count20w,
            all: count15w + count16w + count17w + count18w + count19w + count20w
        },
        scopus: {
            2015: count15s,
            2016: count16s,
            2017: count17s,
            2018: count18s,
            2019: count19s,
            2020: count20s,
            all: count15s + count16s + count17s + count18s + count19s + count20s
        },
        all: {
            2015: count15s + count15w,
            2016: count16s + count16w,
            2017: count17s + count17w,
            2018: count18s + count18w,
            2019: count19s + count19w,
            2020: count20s + count20w,
            all: count15s + count16s + count17s + count18s + count19s + count20s + count15w + count16w + count17w + count18w + count19w + count20w
        }
    };

    //console.table(countTable);
    return countTable;
}

module.exports = main;