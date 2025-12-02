import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../lib/mongodb.js';
import Admin from '../models/Admin.js';

async function main() {
  try {
    const email = process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@halayachts.com';
    const password = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'ChangeMeNow!123';
    const name = process.env.INITIAL_ADMIN_NAME || 'Hala Yachts Admin';

    if (!email || !password) {
      console.error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD (or ADMIN_EMAIL / ADMIN_PASSWORD) must be set.');
      process.exit(1);
    }

    await connectToDatabase();

    let admin = await Admin.findOne({ email });

    if (admin) {
      console.log(`Admin user already exists with email: ${email}`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    admin = await Admin.create({
      email,
      passwordHash,
      name,
      role: 'admin',
    });

    console.log('Admin user created successfully:');
    console.log(`  Email   : ${admin.email}`);
    console.log('  Password: (from INITIAL_ADMIN_PASSWORD / ADMIN_PASSWORD env variable)');
    console.log('IMPORTANT: Store this password securely and rotate it after first login.');

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  }
}

main();


