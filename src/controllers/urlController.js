import { Url } from '../models/index.js'; // Ensure correct import
import { sequelize } from '../config/database.js';



// Function to generate a random short code
const generateShortCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortCode += characters[randomIndex];
    }
    return shortCode;
  };


// Create a shortened URL
export const shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const userId = req.user.userId;

    // Validate URL
    if (!longUrl) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Check if URL is valid
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    // Generate a unique short code
    const shortCode = generateShortCode(); // Implement this function to generate a unique short code

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
    console.error('URL shortening error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Redirect to the original URL
export const redirectToUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    // Find the URL data
    const urlData = await Url.findOne({ where: { short_code: shortCode } });
    if (!urlData) {
      return res.status(404).send('URL not found');
    }
    // Increment the click count
    await Url.update(
      { clicks: urlData.clicks + 1 },
      { where: { id: urlData.id } }
    );
    // Redirect to the original URL
    return res.redirect(urlData.long_url);
  } catch (error) {
    console.error('URL redirect error:', error);
    res.status(500).send('Server error');
  }
};
export const getShareableUrls = async (req, res) => {
  try {
    const userId = req.user.userId;
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`; 
    // Get all URLs for user
    const urls = await Url.findAll({ where: { user_id: userId } });
    // Format response with shareable links
    const shareableUrls = urls.map(url => ({
      id: url.id,
      shortCode: url.short_code,
      longUrl: url.long_url,
      shareableLink: `${baseUrl}/${url.short_code}`,
      createdAt: url.created_at,
      clicks: url.clicks
    }));
    res.status(200).json({
      urls: shareableUrls
    });
  } catch (error) {
    console.error('Get shareable URLs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all URLs for the current user
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all URLs for user
    const urls = await Url.findAll({ where: { user_id: userId } });

    // Format response
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
    console.error('Get user URLs error:', error);
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
      clicks: urlData.clicks,
      createdAt: urlData.created_at
    });
  } catch (error) {
    console.error('Get URL analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
