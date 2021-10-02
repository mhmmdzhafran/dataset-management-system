const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
    dbPath: process.env.DB_PATH,
    routePath: path.resolve(__dirname, '..')
}

