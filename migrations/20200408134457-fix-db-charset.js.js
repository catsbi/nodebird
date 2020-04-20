'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
        `ALTER DATABASE ${
            queryInterface.sequelize.config.database
        } CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
