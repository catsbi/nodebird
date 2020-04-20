require('dotenv').config();
module.exports =
    {
        "development": {
            "username": "codesquare",
            "password": process.env.SEQUELIZE_PASSWORD,
            "database": "database_nodejs",
            "host": "codesquare.coqcckw5gvux.ap-northeast-2.rds.amazonaws.com",
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
            "username": "codesquare",
            "password": process.env.SEQUELIZE_PASSWORD,
            "database": "database_nodejs",
            "host": "codesquare.coqcckw5gvux.ap-northeast-2.rds.amazonaws.com",
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
