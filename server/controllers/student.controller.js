import { PrismaClient } from '@prisma/client';
import { io } from '../server.js';

const prisma = new PrismaClient();

// Get Student Dashboard
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user balance and credit info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentBalance: true,
        creditLimit: true,
        firstName: true,
        lastName: true
      }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: {
            businessName: true
          }
        }
      }
    });

    // Get pending payments
    const pendingPayments = await prisma.payment.findMany({
      where: {
        userId,
        status: 'PENDING'
      },
      select: {
        id: true,
        amount: true,
        createdAt: true
      }
    });

    // Get upcoming events
    const upcomingEvents = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            eventDate: true,
            location: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          availableCredit: user.creditLimit - user.currentBalance,
          totalOrders: recentOrders.length,
          pendingAmount: pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0)
        },
        recentOrders,
        pendingPayments,
        upcomingEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: error.message
    });
  }
};

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, items, specialInstructions } = req.body;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.itemId }
      });
      totalAmount += Number(menuItem.price) * item.quantity;
    }

    // Check credit limit
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.currentBalance + totalAmount > user.creditLimit) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credit limit'
      });
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        providerId,
        totalAmount,
        specialInstructions,
        items: {
          create: items.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            notes: item.notes
          }))
        }
      },
      include: {
        items: {
          include: {
            item: true
          }
        },
        provider: true
      }
    });

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentBalance: {
          increment: totalAmount
        }
      }
    });

    // Send real-time notification
    io.to(`user:${providerId}`).emit('newOrder', order);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: providerId,
        title: 'New Order Received',
        message: `You have a new order #${orderNumber}`,
        type: 'ORDER',
        data: { orderId: order.id }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

// Get Order History
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const orders = await prisma.order.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: {
            businessName: true,
            location: true
          }
        },
        items: {
          include: {
            item: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    const total = await prisma.order.count({
      where: { userId }
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get order history',
      error: error.message
    });
  }
};