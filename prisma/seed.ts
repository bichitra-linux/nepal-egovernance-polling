import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing users if needed (comment out if you want to keep existing users)
  await prisma.vote.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      role: 'user'
    }
  });
  
  console.log('Seeding database with normal users...');

  // Define standard password for all test users
  const password = 'Nepal@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create 20 regular users
  const districts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kaski', 'Chitwan',
    'Morang', 'Sunsari', 'Jhapa', 'Rupandehi', 'Kailali'
  ];
  
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Citizen ${i}`,
        email: `citizen${i}@example.com`,
        password: hashedPassword,
        role: 'user',
        phoneNumber: `+9779${i.toString().padStart(8, '0')}`,
        province: Math.min(i % 7 + 1, 7).toString(),
        district: districts[i % districts.length],
        localLevel: `Municipality ${(i % 5) + 1}`,
        citizenshipNo: `${100000 + i}`,
        voterIdNo: `V${200000 + i}`,
      },
    });
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }

  console.log('Database seeding completed successfully!');
  console.log('\nUser Credentials Summary:');
  console.log('-------------------------');
  console.log('Standard password for all users: Nepal@123');
  
  console.log('\nUser Accounts:');
  users.forEach(user => {
    console.log(`- ${user.name} (${user.email})`);
  });
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });