const envalid = require('envalid');

const { str, port, bool } = envalid
 
const main = envalid.cleanEnv(process.env, {
    DB_NAME:            str(),
    DB_USER:            str(),
    DB_PASSWORD:        str(),
    DB_HOST:            str(),
    PORT:               port(),
    HTTPS_PORT:         port(),
    REDIS_HOST:         str(),
    REDIS_PORT:         port(),
    HTTPS:              bool()
})

module.exports = main;