const sqlite3 = require('sqlite3').verbose();

const {dbPath} = require('../config');

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        throw err;
    }
    console.log("Koneksi ke database berhasil!");
});

module.exports = db;