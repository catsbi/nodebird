require('dotenv').config();
module.exports =
    {
        "development": {
            "username": "root",
            "password": process.env.SEQUELIZE_PASSWORD,
            "database": "database_nodejs",
            "host": '127.0.0.1',
            "dialect": "mysql",
            "operatorsAliases": false,
            "define": {
                "charset": "utf8mb4",
                "dialectOptions": {
                    "collate": "utf8mb4_general_ci"
                }
            }
        },
        "test": {
            "username": "root",
            "password": null,
            "database": "database_test",
            "host": "127.0.0.1",
            "dialect": "mysql",
            "operatorsAliases": false
        },
        "production": {
            "username": "root",
            "password": process.env.SEQUELIZE_PASSWORD,
            "database": "database_nodejs",
            "host": '127.0.0.1',
            "dialect": "mysql",
            "operatorsAliases": false,
            "define": {
                "charset": "utf8mb4",
                "dialectOptions": {
                    "collate": "utf8mb4_general_ci"
                }
            },
            "logging":false,
        }
    }
