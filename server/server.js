const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB - بدون خيارات قديمة
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/donation_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📊 Database: ${MONGODB_URI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running on port 27017');
    console.log('💡 Run: docker run -d -p 27017:27017 --name mongodb mongo');
  });

// Donation Schema
const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('Donation', donationSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Donation API is running!',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      donations: {
        POST: '/api/donations',
        GET: '/api/donations'
      },
      contact: {
        POST: '/api/contact',
        GET: '/api/contact'
      },
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    mongodbState: mongoose.connection.readyState
  });
});

// Create donation
app.post('/api/donations', async (req, res) => {
  try {
    console.log('📥 Received donation request:', req.body);
    
    const { name, email, amount, donationType = 'one-time', currency = 'USD' } = req.body;
    
    // Validation
    if (!name || !email || !amount) {
      console.log('❌ Missing data:', { name, email, amount });
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and amount are required'
      });
    }

    // Create new donation
    const donation = new Donation({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount: parseFloat(amount),
      donationType,
      currency
    });

    await donation.save();
    
    console.log('✅ Donation saved to MongoDB:', {
      id: donation._id,
      name: donation.name,
      email: donation.email,
      amount: donation.amount
    });

    res.status(201).json({
      success: true,
      message: `Thank you for your ${donationType} donation of $${amount}!`,
      donationId: donation._id,
      data: donation
    });

  } catch (error) {
    console.error('❌ Error saving donation:', error.message);
    console.error('❌ Full error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process donation: ' + error.message
    });
  }
});

// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    console.log('📥 Getting all donations from MongoDB');
    
    const donations = await Donation.find().sort({ createdAt: -1 });
    
    console.log(`📊 Found ${donations.length} donations in MongoDB`);
    
    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error('❌ Error fetching donations:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donations'
    });
  }
});

// Get donation by ID
app.get('/api/donations/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
    }
    
    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donation'
    });
  }
});

// Create contact message
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📥 Received contact request:', req.body);
    
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and message are required' 
      });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    await contact.save();
    
    console.log('✅ Contact saved to MongoDB:', contact._id);
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will contact you soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to save message'
    });
  }
});

// Get all contacts
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Server is running
  🔗 URL: http://localhost:${PORT}
  🌐 Frontend: http://localhost:5173
  📊 Database: MongoDB (${MONGODB_URI})
  `);
  
  // Log initial donations count
  Donation.countDocuments()
    .then(count => {
      console.log(`📊 Current donations in MongoDB: ${count}`);
    })
    .catch(err => {
      console.log('📊 Could not count donations:', err.message);
    });
});