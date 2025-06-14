// src/controllers/banner/bannerController.js

const bannerService = require('../../services/banner/bannerService');
const awsService = require('../../utils/AWSUploads');

// GET /api/banner
const getBanner = async (req, res) => {
  try {
    const banner = await bannerService.getLatestBanner();
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/banner  (image upload + DB save)
const createBanner = async (req, res) => {
  try {
    const image = req.file;
    const { linkUrl } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const filename = `banner-images/${Date.now()}_${image.originalname}`;
    const imageUrl = await awsService.uploadToS3(image.buffer, filename);

    const banner = await bannerService.createNewBanner(imageUrl, linkUrl);

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBanner,
  createBanner,
};
