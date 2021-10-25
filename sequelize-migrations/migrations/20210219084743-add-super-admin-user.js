'use strict';

const userData = {
  first_name: 'super admin',
  last_name: 'betfan',
  email: 'admin@betfan.pl',
  password: '26dc318942685872cf79c5eb96c9bb13', // Admin@12345
  created_at: new Date(),
  updated_at: new Date(),
};

const roleData = {
  role_name: 'Super Admin',
  role_description: 'Super admin have all access',
  all_permissions: true,
  created_at: new Date(),
  updated_at: new Date(),
};

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const [users, roles] = await Promise.all([
        queryInterface.bulkInsert('users', [userData], { returning: true, transaction }),
        queryInterface.bulkInsert('roles', [roleData], { transaction, returning: true }),
      ]);
      await queryInterface.bulkInsert(
        'users_roles',
        [
          {
            role_id: roles[0].role_id,
            user_id: users[0].user_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    try {
      const transaction = await queryInterface.sequelize.transaction();
      const [roleRecords, userRecords] = await Promise.all([
        queryInterface.sequelize.query(`SELECT * FROM roles where role_name='${roleData.role_name}'`),
        queryInterface.sequelize.query(`SELECT * from users where email='${userData.email}'`),
      ]);
      const roleRecord = roleRecords && roleRecords[0] && roleRecords[0][0];
      const userRecord = userRecords && userRecords[0] && userRecords[0][0];
      if (roleRecord) {
        await queryInterface.bulkDelete('users_roles', { role_id: roleRecord.role_id });
        await queryInterface.bulkDelete('roles', { role_id: roleRecord.role_id });
      }
      if (userRecord) {
        await queryInterface.bulkDelete('users_roles', { user_id: userRecord.user_id });
        await queryInterface.bulkDelete('users', { user_id: userRecord.user_id });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
