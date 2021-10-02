const db = require('../index');

db.serialize(function(){
    let sql = "INSERT INTO tasks (name, created_user_id, booked_user_id, task_description, status) VALUES ('Task Dataset 1', '1', '1', 'Dataset Project', 'booked'), ('Task Dataset 2', '1', null, 'Restaurant dataset', 'not booked'), ('Task Dataset 3', '2', null, 'Store dataset', 'not booked')";
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("3 record inserted");
    });

});

db.close();