const Contact = require('../models/Contact');

// Send contact message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message, phone, subject } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }
    
    const contact = new Contact({
      name,
      email,
      message,
      phone,
      subject
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will contact you soon.',
      data: contact
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
};

// Get all contact messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
};