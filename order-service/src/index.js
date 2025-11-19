const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://order-mongo:27017/orderdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const orderSchema = new mongoose.Schema({
  userId: String,
  item: String,
  quantity: Number
});
const Order = mongoose.model('Order', orderSchema);

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Create multiple orders
app.post('/order', authenticateToken, async (req, res) => {
  const { orders } = req.body;
  if (!orders || !Array.isArray(orders) || orders.length === 0)
    return res.status(400).json({ error: 'No orders provided' });

  const savedOrders = [];
  for (const o of orders) {
    const order = new Order({
      userId: req.user.id,
      item: o.item,
      quantity: o.quantity
    });
    await order.save();
    savedOrders.push(order);
  }
  res.json(savedOrders);
});

// Get user orders
app.get('/orders', authenticateToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

const PORT = 3000; // container port
app.listen(PORT, '0.0.0.0', () => console.log('Order service running on port 3000'));
