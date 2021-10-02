const db = require('../index');

db.serialize(function(){
    let sql = "INSERT INTO users (name, username, password, email) VALUES ('Anton', 'AntonUser1', '$2a$12$x.vh3pnCS3wopQrYP75ei.WfjuyvYEtBMEytd9q/u1ed5P/NnUvnm', 'antonUser1@test.com'), ('Fera', 'FeraUser2', '$2a$12$x.vh3pnCS3wopQrYP75ei.WfjuyvYEtBMEytd9q/u1ed5P/NnUvnm', 'feraUser2@test.com'), ('Maree', 'MareeUser3', '$2a$12$x.vh3pnCS3wopQrYP75ei.WfjuyvYEtBMEytd9q/u1ed5P/NnUvnm', 'mareeUser3@test.com')";
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("3 record inserted");
    });

});

db.close();