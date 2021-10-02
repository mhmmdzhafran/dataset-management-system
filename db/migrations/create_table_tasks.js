const db = require('../index');

db.serialize(function(){
    let sql = `CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(225),
        created_user_id INTEGER,
        booked_user_id INTEGER,
        task_description VARCHAR(225),
        status TEXT CHECK(status IN ('booked', 'not booked') ) DEFAULT 'not booked',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deletedAt TIMESTAMP NULL,
        FOREIGN KEY(created_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY(booked_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`;
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("Table created");
    });
});

db.close();