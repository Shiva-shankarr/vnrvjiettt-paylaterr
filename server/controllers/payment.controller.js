import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, description } = req.body;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        description
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        paymentMethod: 'ONLINE',
        razorpayOrderId: razorpayOrder.id,
        description
      }
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentDate: new Date()
        }
      });

      // Update user balance
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          currentBalance: {
            decrement: payment.amount
          }
        }
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment
      });
    } else {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'FAILED'
        }
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: error.message
    });
  }
};