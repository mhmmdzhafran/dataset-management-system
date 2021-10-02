const {Sequelize, DataTypes} = require("sequelize");
const {dbPath} = require('../../config');
const sequalize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});



const User = sequalize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: DataTypes.STRING(225),
    username: DataTypes.STRING(225),
    password: DataTypes.STRING(225),
    email: DataTypes.STRING(225)
}, {
    timestamps: true,
    modelName: "users"
});

const Tasks = sequalize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: DataTypes.STRING(225),
    created_user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    booked_user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    task_description: DataTypes.STRING(225),
    status : {
        type: DataTypes.ENUM,
        values: ['booked', 'not booked']
    },
    createdAt: DataTypes.TIME,
    updatedAt: DataTypes.TIME,
    deletedAt: {
        type: DataTypes.TIME,
        allowNull: true,
    },
}, {
    timestamps: true,
    paranoid: true,
    modelName: "tasks"
});

const dataset = sequalize.define("datasets", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tasks',
            key: 'id'
        }
    },
    file_name: DataTypes.TEXT,
    deletedAt: {
        type: DataTypes.TIME,
        allowNull: true,
    },
},  {
    timestamps: true,
    paranoid: true,
    modelName: "datasets"
});

// relationship

User.hasMany(Tasks, {
    targetKey: 'id',
    foreignKey : 'created_user_id',
    foreignKeyConstraint: false,
});

User.hasMany(Tasks, {
    targetKey: 'id',
    foreignKey : 'booked_user_id',
    foreignKeyConstraint: false,
});

Tasks.belongsTo(User, {
    foreignKey: 'created_user_id',
    foreignKeyConstraint: false,
    targetKey: 'id',
    as: 'task_user'
});

Tasks.belongsTo(User, {
    foreignKey: 'booked_user_id',
    foreignKeyConstraint: false,
    targetKey: 'id',
    as: 'booked_user'
});

Tasks.hasOne(dataset, {
    foreignKey: 'task_id',
    sourceKey: 'id',
    as:'dataset',
    foreignKeyConstraint: false,
})

dataset.belongsTo(Tasks, {
    foreignKey: 'task_id',
    targetKey: 'id',
    foreignKeyConstraint: false,
})


module.exports = {
    Tasks,
    User,
    dataset,
    sequalize
};