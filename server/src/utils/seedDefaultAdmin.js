const User = require('../modules/user/user.model');
const logger = require('./logger');

const seedDefaultAdmin = async () => {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@mironepal.com.np';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Miro Nepal Admin';

  try {
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        authProvider: 'local',
        viewOnly: false,
        isDemo: false,
      });
      logger.info(`Default admin account provisioned: ${adminEmail}`);
    } else {
      existingAdmin.name = adminName;
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      existingAdmin.viewOnly = false;
      existingAdmin.isDemo = false;
      existingAdmin.loginAttempts = 0;
      existingAdmin.lockUntil = undefined;
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      logger.info(`Default admin account synchronized: ${adminEmail}`);
    }
  } catch (error) {
    logger.error(`Error provisioning default admin: ${error.message}`);
  }
};

module.exports = seedDefaultAdmin;
