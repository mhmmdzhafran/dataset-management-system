const db = require('../index');

db.serialize(function(){
    let sql = `CREATE TABLE IF NOT EXISTS datasets(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        file_name LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deletedAt TIMESTAMP NULL,
        FOREIGN KEY(task_id) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`;
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("Table created");
    });
});

db.close();