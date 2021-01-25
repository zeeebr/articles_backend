const {
    PaperS,
    NewEidS
} = require('./models/scopus');
const {
    PaperW,
    NewEidW
} = require('./models/wos');
const paperS = new PaperS();
const paperW = new PaperW();
const newEidS = new NewEidS();
const newEidW = new NewEidW();
const env = require('./env.js');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
});
const cron = require('node-cron');

client.on("error", function (err) {
    console.log("Error " + err);
});

cron.schedule('* * * * * *', main);

async function main() {
    let count16w = await paperW.count('2016');
    let count17w = await paperW.count('2017');
    let count18w = await paperW.count('2018');
    let count19w = await paperW.count('2019');
    let count20w = await paperW.count('2020');
    let count21w = await paperW.count('2021');

    let count16wP = await newEidW.count('2016');
    let count17wP = await newEidW.count('2017');
    let count18wP = await newEidW.count('2018');
    let count19wP = await newEidW.count('2019');
    let count20wP = await newEidW.count('2020');
    let count21wP = await newEidW.count('2021');

    let count16s = await paperS.count('2016');
    let count17s = await paperS.count('2017');
    let count18s = await paperS.count('2018');
    let count19s = await paperS.count('2019');
    let count20s = await paperS.count('2020');
    let count21s = await paperS.count('2021');

    let count16sP = await newEidS.count('2016');
    let count17sP = await newEidS.count('2017');
    let count18sP = await newEidS.count('2018');
    let count19sP = await newEidS.count('2019');
    let count20sP = await newEidS.count('2020');
    let count21sP = await newEidS.count('2021');

    let countTable = {
        wos: {
            '2016': count16w,
            '2017': count17w,
            '2018': count18w,
            '2019': count19w,
            '2020': count20w,
            '2021': count21w,
            '2016+': count16wP,
            '2017+': count17wP,
            '2018+': count18wP,
            '2019+': count19wP,
            '2020+': count20wP,
            '2021+': count21wP,
            all: count16w + count17w + count18w + count19w + count20w + count21w
        },
        scopus: {
            '2016': count16s,
            '2017': count17s,
            '2018': count18s,
            '2019': count19s,
            '2020': count20s,
            '2021': count21s,
            '2016+': count16sP,
            '2017+': count17sP,
            '2018+': count18sP,
            '2019+': count19sP,
            '2020+': count20sP,
            '2021+': count21sP,
            'all': count16s + count17s + count18s + count19s + count20s + count21s
        },
        all: {
            '2016': count16s + count16w,
            '2017': count17s + count17w,
            '2018': count18s + count18w,
            '2019': count19s + count19w,
            '2020': count20s + count20w,
            '2021': count21s + count21w,
            'all': count16s + count17s + count18s + count19s + count20s + count21s + count16w + count17w + count18w + count19w + count20w + count21w,
            'all+': count16sP + count17sP + count18sP + count19sP + count20sP + count21sP + count16wP + count17wP + count18wP + count19wP + count20wP + count21wP
        }
    };

    await client.set('counter', JSON.stringify(countTable));

    return true;
}