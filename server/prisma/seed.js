import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@vnrvjiet.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      isActive: true
    }
  });

  // Create Sample Students
  const studentPassword = await bcrypt.hash('student123', 10);
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@vnrvjiet.in',
        passwordHash: studentPassword,
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        studentId: '20B81A0501',
        department: 'CSE',
        year: 3,
        isVerified: true,
        creditLimit: 5000,
        currentBalance: 1200
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@vnrvjiet.in',
        passwordHash: studentPassword,
        role: 'STUDENT',
        firstName: 'Jane',
        lastName: 'Smith',
        studentId: '20B81A0502',
        department: 'ECE',
        year: 2,
        isVerified: true,
        creditLimit: 5000,
        currentBalance: 800
      }
    })
  ]);

  // Create Service Provider
  const providerPassword = await bcrypt.hash('provider123', 10);
  const providerUser = await prisma.user.create({
    data: {
      email: 'canteen@vnrvjiet.in',
      passwordHash: providerPassword,
      role: 'PROVIDER',
      firstName: 'Canteen',
      lastName: 'Manager',
      isVerified: true
    }
  });

  const provider = await prisma.serviceProvider.create({
    data: {
      userId: providerUser.id,
      businessName: 'VNRVJIET Main Canteen',
      serviceType: 'CANTEEN',
      location: 'Ground Floor, Main Building',
      description: 'Your campus food destination',
      operatingHours: {
        monday: '8:00 AM - 8:00 PM',
        tuesday: '8:00 AM - 8:00 PM',
        wednesday: '8:00 AM - 8:00 PM',
        thursday: '8:00 AM - 8:00 PM',
        friday: '8:00 AM - 8:00 PM',
        saturday: '8:00 AM - 4:00 PM'
      },
      contactPhone: '9876543210',
      isActive: true
    }
  });

  // Create Menu Items
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        providerId: provider.id,
        name: 'Masala Dosa',
        description: 'Crispy dosa with potato filling',
        price: 40,
        category: 'Breakfast',
        isVeg: true,
        isAvailable: true,
        preparationTime: 10
      }
    }),
    prisma.menuItem.create({
      data: {
        providerId: provider.id,
        name: 'Veg Biryani',
        description: 'Aromatic rice with mixed vegetables',
        price: 80,
        category: 'Lunch',
        isVeg: true,
        isAvailable: true,
        preparationTime: 15
      }
    }),
    prisma.menuItem.create({
      data: {
        providerId: provider.id,
        name: 'Chicken Biryani',
        description: 'Flavorful rice with tender chicken',
        price: 120,
        category: 'Lunch',
        isVeg: false,
        isAvailable: true,
        preparationTime: 20
      }
    }),
    prisma.menuItem.create({
      data: {
        providerId: provider.id,
        name: 'Samosa',
        description: 'Crispy fried snack with potato filling',
        price: 15,
        category: 'Snacks',
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      }
    }),
    prisma.menuItem.create({
      data: {
        providerId: provider.id,
        name: 'Coffee',
        description: 'Hot filter coffee',
        price: 20,
        category: 'Beverages',
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      }
    })
  ]);

  // Create Event Manager
  const eventManagerPassword = await bcrypt.hash('event123', 10);
  const eventManager = await prisma.user.create({
    data: {
      email: 'events@vnrvjiet.in',
      passwordHash: eventManagerPassword,
      role: 'EVENT_MANAGER',
      firstName: 'Event',
      lastName: 'Coordinator',
      isVerified: true
    }
  });

  // Create Sample Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        managerId: eventManager.id,
        title: 'Tech Fest 2024',
        description: 'Annual technical festival with competitions and workshops',
        eventDate: new Date('2024-12-15'),
        location: 'Main Auditorium',
        totalSeats: 500,
        availableSeats: 450,
        price: 200,
        category: 'Technical',
        registrationDeadline: new Date('2024-12-10'),
        isActive: true
      }
    }),
    prisma.event.create({
      data: {
        managerId: eventManager.id,
        title: 'Cultural Night',
        description: 'Evening of music, dance, and drama performances',
        eventDate: new Date('2024-11-20'),
        location: 'Open Air Theatre',
        totalSeats: 300,
        availableSeats: 250,
        price: 100,
        category: 'Cultural',
        registrationDeadline: new Date('2024-11-18'),
        isActive: true
      }
    })
  ]);

  // Create Sample Orders
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD001',
      userId: students[0].id,
      providerId: provider.id,
      totalAmount: 135,
      status: 'DELIVERED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'CREDIT',
      items: {
        create: [
          {
            itemId: menuItems[1].id,
            quantity: 1,
            unitPrice: 80,
            totalPrice: 80
          },
          {
            itemId: menuItems[3].id,
            quantity: 2,
            unitPrice: 15,
            totalPrice: 30
          },
          {
            itemId: menuItems[4].id,
            quantity: 1,
            unitPrice: 20,
            totalPrice: 20
          }
        ]
      }
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Test Accounts:');
  console.log('   Admin: admin@vnrvjiet.in / admin123');
  console.log('   Student: john.doe@vnrvjiet.in / student123');
  console.log('   Provider: canteen@vnrvjiet.in / provider123');
  console.log('   Event Manager: events@vnrvjiet.in / event123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });