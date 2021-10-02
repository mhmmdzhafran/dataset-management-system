const db = require('../index');

db.serialize(function(){
    let sql = "INSERT INTO datasets (task_id, file_name) VALUES ('1', 'task1_people-with-technology-devices.zip'), ('2', 'task2_people-with-technology-devices.zip'), ('3', 'task3_people-with-technology-devices.zip')";
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("3 record inserted");
    });

});

db.close();