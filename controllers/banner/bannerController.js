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




const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Get banner from DB
    const banner = await bannerService.getBannerById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Extract filename from S3 URL
    const key = banner.imageUrl.split('.com/')[1];

    // Delete from S3
    await awsService.deleteFromS3(key);

    // Delete from DB
    await bannerService.deleteBannerById(id);

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  deleteBanner,
  getBanner,
  createBanner,
};
