import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const p = new PrismaClient();

async function main() {
  const u = await p.user.findFirst({ where: { email: 'admin@alwaheed-stone.com' } });
  if (!u) {
    console.log('❌ USER NOT FOUND in database!');
    console.log('All users:');
    const all = await p.user.findMany({ select: { email: true, role: true, isActive: true } });
    console.log(JSON.stringify(all, null, 2));
  } else {
    console.log('✅ User found:');
    console.log('  email:', u.email);
    console.log('  role:', u.role);
    console.log('  isActive:', u.isActive);
    console.log('  hash prefix:', u.passwordHash.slice(0, 25));
    const ok = await bcrypt.compare('Admin@AlWaheed2026!', u.passwordHash);
    console.log('  Password "Admin@AlWaheed2026!" valid:', ok);
  }
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
