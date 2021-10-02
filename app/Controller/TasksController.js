const {Tasks, User, dataset, sequalize} = require('../Model/TasksModel');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
    indexDashboard: async(req, res) => {
        const {id, name} = req.session.user;
        const allTask = await Tasks.findAll({where:{created_user_id: id}});
        res.render('task/index', {  
            allTask,
            id: id,
            name: name,
            title: 'All Task'
        });
    },
    index: async(req,res) => {
        try {
            const allTask = await Tasks.findAll({
                include:{
                    model: User,
                    as: 'task_user'
                }
            });
            res.render('task/dashboard/index', {
                title: 'Task Management',
                id: req.session.user.id,
                name: req.session.user.name,
                allTask
            });
        } catch (error) {
            res.redirect('/tasks');
        }
    },
    detailTask: async(req, res) => {
        try {
            const {id} = req.params;
            const bookUserTask = await Tasks.findOne({ where: {id: id}, include: {
                model: User,
                as: 'booked_user'
            }});
            const userCreateTask = await Tasks.findOne({ where: {id: id}, include: {
                model: User,
                as: 'task_user'
            }});
            const datasets = await dataset.findOne({where: {task_id: id}});
            res.render('task/dashboard/detail', {
                userCreateTask, 
                datasets,
                bookUserTask,
                title: 'Detail Task', 
                id: req.session.user.id,
                name: req.session.user.name
            });
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    viewCreate: async(req, res) => {
        try {
            res.render('task/create', {
                id: req.session.user.id,
                name: req.session.user.name,
                title: 'Create Task'
            });
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    actionCreate: async(req, res) => {
        try {
            const {name, task_description, idUser} = req.body;

            if (req.file) {
                const transaction = await sequalize.transaction();
                let tempPath = req.file.path;
                let extension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.filename+"."+extension;
                let targetPath = path.resolve(config.routePath, `public/uploads/${fileName}`);

                const src = fs.createReadStream(tempPath);
                const dest = fs.createWriteStream(targetPath);
                src.pipe(dest);
                src.on('end', async () => {
                    try {

                        const [_, metadata] = await sequalize.query(`INSERT INTO tasks (name, created_user_id, booked_user_id, task_description, status) VALUES('${name}',' ${idUser}', null, '${task_description}', 'not booked');`, {transaction});


                        await sequalize.query(`INSERT INTO datasets (task_id, file_name) VALUES ('${metadata.lastID}', '${fileName}');`, {transaction});

            
                        await transaction.commit();
                        res.redirect('/tasks/dashboard');
                    } catch (error) {
                        console.log(error);
                    }
                });
            } else {
                res.redirect('/tasks/dashboard');
            }

        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    viewEdit: async(req, res) => {
        try {
            const {id} = req.params;
            const findTask = await Tasks.findOne({ where: {id: id}});
            const datasets = await Tasks.findOne({ where: {id: id}, include: {  
                model : dataset,
                as: 'dataset'
            }});
            if (findTask.status === "booked") {
                res.redirect('/tasks/dashboard');
            }
            res.render('task/edit', {
                findTask, 
                datasets,
                title: 'Edit A Task', 
                id: req.session.user.id,
                name: req.session.user.name
            });
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    actionEdit: async(req, res) => {
        try {
            const {id} = req.params;
            const {name, task_description, idUser} = req.body;

            const getTasks = await Tasks.findOne({where: {id: id}, include: {  
                model : dataset,
                as: 'dataset'
            }});

            if (!getTasks) {
                res.redirect('/tasks/dashboard');
            } else if (getTasks.status === "booked") {
                res.redirect('/tasks/dashboard');
            } else {
                const transaction = await sequalize.transaction();
                if (req.file) {
                    let tempPath = req.file.path;
                    let extension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                    let fileName = req.file.filename+"."+extension;
                    let targetPath = path.resolve(config.routePath, `public/uploads/${fileName}`);
    
                    const src = fs.createReadStream(tempPath);
                    const dest = fs.createWriteStream(targetPath);
                    src.pipe(dest);
                    src.on('end', async () => {
                        try {
                            console.log(fileName, getTasks.dataset.file_name);
                            let currentImage = `${config.routePath}/public/uploads/${getTasks.dataset.file_name}`;
                            
                            if (fs.existsSync(currentImage)) {
                                fs.unlinkSync(currentImage);
                            }  
                            await sequalize.query(`UPDATE tasks SET name = '${name}', created_user_id = '${idUser}', booked_user_id = null, task_description = '${task_description}', status = 'not booked' WHERE  id = ${id};`, {transaction});
    
                            await sequalize.query(`UPDATE datasets SET task_id = '${id}', file_name = '${fileName}' WHERE id = '${id}';`, {transaction});
    
                            await transaction.commit();

                            res.redirect('/tasks/dashboard');
                        } catch (error) {
                            res.redirect('/tasks/dashboard');
                        }
                    });
                } else {
                    const [_, metadata] = await sequalize.query(`UPDATE tasks SET name = '${name}', created_user_id = '${idUser}', booked_user_id = null, task_description = '${task_description}', status = 'not booked' WHERE  id = ${id};`, {transaction});

                    await sequalize.query(`UPDATE datasets SET task_id = '${metadata.lastID}' WHERE id = '${id}';`, {transaction});

                    await transaction.commit();

                    res.redirect('/tasks/dashboard');
                }
            }
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    actionDelete: async(req, res) => {
        try {
            const {id} = req.params;
            const getTasks = await Tasks.findOne({where: {id: id}, include: {model : dataset, as: 'dataset'}});

            if (!getTasks) {
                res.redirect('/tasks/dashboard');
            } else {
                try {
                    if (getTasks.status === 'booked') {
                        res.sendStatus(404).json({message: "task already booked"});
                    } else {
                        await Tasks.destroy({where: {id: id}});

                        let currentImage = `${config.routePath}/uploads/${getTasks.dataset.file_name}`;

                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }
                        res.redirect('/tasks/dashboard');
                    }
                } catch (error) {
                    res.redirect('/tasks/dashboard');
                }
            }
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    actionRevoked: async(req, res) => {
        const {id} = req.params;
        const {id: idUser} = req.session.user;
        try {
            const getTasks = await Tasks.findOne({where: {id: id, booked_user_id: idUser}});
            if (!getTasks) {
                req.flash("alertMessage", "User tidak teregistrasi");
                req.flash("alertStatus", 'danger');
                res.redirect('/tasks/dashboard');
            } else {
                if (getTasks.status === "booked") {
                    const bookedStatus = "not booked";

                    await sequalize.query(`UPDATE tasks SET booked_user_id = null, status = '${bookedStatus}' WHERE id = ${id};`);

                    res.redirect('/tasks/');
                }
            }    
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
        
    },
    bookedTask: async(req, res) => {
        const {id} = req.params;
        console.log(req.session);
        const {id: idUser} = req.session.user;
        try {
            const getTasks = await Tasks.findOne({where: {id: id}});
            console.log(getTasks);
            if (!getTasks) {
                res.sendStatus(404).json({message: "task not found"});
            } else {
                if (getTasks.status === "booked") {
                    res.sendStatus(404).json({message: "task not found"});
                } else {
                    const bookedStatus = "booked";

                    await sequalize.query(`UPDATE tasks SET booked_user_id = '${idUser}', status = '${bookedStatus}' WHERE id = ${id};`);

                    res.redirect('/tasks');
                }
            }    
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    },
    viewDetail: async(req, res) => {
        try {
            const {id} = req.params;
            console.log(req.params);
            const findTask = await Tasks.findOne({ where: {id: id}});
            const detailUser = await Tasks.findOne({ where: {id: id}, include: {  
                model : User,
                as: 'booked_user'
            }});
            const datasets = await Tasks.findOne({ where: {id: id}, include: {  
                model : dataset,
                as: 'dataset'
            }});
           
            res.render('task/detail', {
                findTask,
                detailUser, 
                datasets,
                title: 'Detail Task', 
                id: req.session.user.id,
                name: req.session.user.name
            });
        } catch (error) {
            res.redirect('/tasks/dashboard');
        }
    }
}