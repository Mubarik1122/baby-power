/**
 * One-shot production repair:
 * - Reactivates all products (public catalogue filters isActive: true)
 * - Ensures admin user exists / password matches ADMIN_EMAIL + ADMIN_PASSWORD
 *
 * Run once:
 *   REPAIR_CATALOGUE=true node src/utils/repairCatalogue.js
 * Or set REPAIR_CATALOGUE=true on Render, redeploy, then remove the env var.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

async function repairCatalogue({ connect = true } = {}) {
  if (connect) await connectDB();

  const inactive = await Product.countDocuments({ isActive: false });
  const activated = await Product.updateMany(
    { isActive: false },
    { $set: { isActive: true } }
  );
  console.log(`Products reactivated: ${activated.modifiedCount} (were inactive: ${inactive})`);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    let admin = await User.findOne({ email: email.toLowerCase() });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin',
      });
      console.log(`Admin created: ${admin.email}`);
    } else {
      admin.password = password;
      admin.role = 'admin';
      await admin.save();
      console.log(`Admin password reset: ${admin.email}`);
    }
  } else {
    console.log('Skipped admin repair (set ADMIN_EMAIL and ADMIN_PASSWORD to reset login).');
  }

  const publicCount = await Product.countDocuments({ isActive: true });
  console.log(`Active products now: ${publicCount}`);
}

if (require.main === module) {
  repairCatalogue()
    .then(async () => {
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Repair failed:', err);
      try {
        await mongoose.connection.close();
      } catch {
        // ignore
      }
      process.exit(1);
    });
}

module.exports = { repairCatalogue };
