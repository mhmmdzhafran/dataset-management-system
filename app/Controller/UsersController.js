const {User} = require('../Model/TasksModel');
const bcrypt = require('bcryptjs');

const HASH_SALT = 12;

module.exports = {
    login: async(req, res) => {
        try {
            const {email, password} = req.body;
            const users = await User.findOne({where: {email: email}});
            try {
                if (users) {
                    const checkPassword = await bcrypt.compare(password, users.password);
                    if (checkPassword) {
                        req.session.user = {
                            id: users.id,
                            name: users.name,
                            email: users.email
                        }
                        res.redirect('/tasks/');
                    } else {
                        res.redirect('/');
                    }
                } else {
                    res.redirect('/');
                } 
            } catch (error) {
                res.redirect('/');
            }
               
        } catch (error) {
            res.redirect('/');
        }
    },
    signUp: async(req, res) => {
        try {
            const {name, email, password} = req.body;
            const passwordUser = await bcrypt.hash(password, HASH_SALT);
            const users = await User.findOne({where: {email: email}});
            if (users) {
                res.redirect('/');
            } else {
                const user = await User.create({
                    name: name,
                    email: email,
                    password: passwordUser
                });
                res.redirect('/');
            }    
        } catch (error) {
            res.redirect('/');
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}