const db = require('../index');

db.serialize(function(){
    let sql = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(225),
        username VARCHAR(225),
        password VARCHAR(225),
        email VARCHAR(225),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`;
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("Table created");
    });
});

db.close();