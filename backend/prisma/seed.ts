import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@deceivenet.io';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('✅ Admin user already exists — skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin123', 12);

  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email,
      passwordHash,
      role: 'admin',
      status: 'active',
    },
  });

  console.log('✅ Admin user created:');
  console.log('   Email   :', user.email);
  console.log('   Password: Admin123');
  console.log('   Role    :', user.role);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
