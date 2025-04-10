import { Url } from '../models/index.js'; // Ensure correct import
import { sequelize } from '../config/database.js';



// Function  generate a random short code
const generateShortCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortCode += characters[randomIndex];
    }
    return shortCode;
  };



// Create  shortened URL
export const shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const userId = req.user.userId;

    if (!longUrl) {
      return res.status(400).json({ message: 'URL is required' });
    }

    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    // Generate unique short code
    const shortCode = generateShortCode(); 

    // Create shortened URL
    const urlData = await Url.create({
      user_id: userId,
      short_code: shortCode,
      long_url: longUrl,
      created_at: new Date(),
      clicks: 0
    });

    res.status(201).json({
      message: 'URL shortened successfully',
      url: {
        id: urlData.id,
        shortCode: urlData.short_code,
        longUrl: urlData.long_url,
        createdAt: urlData.created_at,
        clicks: urlData.clicks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get all URLs for the  user
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.userId;

    const urls = await Url.findAll({ where: { user_id: userId } });

    const formattedUrls = urls.map(url => ({
      id: url.id,
      shortCode: url.short_code,
      longUrl: url.long_url,
      createdAt: url.created_at,
      clicks: url.clicks
    }));

    res.status(200).json({
      urls: formattedUrls
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get analytics for a URL
export const getUrlAnalytics = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const userId = req.user.userId;

    // Get URL data first to check ownership
    const urlData = await Url.findOne({ where: { short_code: shortUrl, user_id: userId } });

    if (!urlData) {
      return res.status(404).json({ message: 'URL not found or access denied' });
    }

    // Return analytics data
    res.status(200).json({
      long_url: urlData.long_url,
      short_code: urlData.short_code,
      clicks: urlData.clicks,
      createdAt: urlData.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
