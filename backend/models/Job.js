const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Job = sequelize.define('Job', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSON,
            allowNull: true
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
            defaultValue: 'MEDIUM'
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
            defaultValue: 'PENDING'
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'jobs',
        timestamps: true
    });

    return Job;
};
