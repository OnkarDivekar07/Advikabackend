// src/controllers/banner/bannerController.js

const bannerService = require('../../services/banner/bannerService');
const awsService = require('../../utils/AWSUploads');
const CustomError=require('../../utils/customError')
// GET /api/banner
const getBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.getLatestBanner();
    res.json(banner);
  } catch (err) {
    next(err)
  }
};

// POST /api/banner  (image upload + DB save)
const createBanner = async (req, res,next) => {
  try {
    const image = req.file;
    const { linkUrl } = req.body;

    if (!image) {
    throw new CustomError('No image file uploaded', 400);}


    const filename = `banner-images/${Date.now()}_${image.originalname}`;
    const imageUrl = await awsService.uploadToS3(image.buffer, filename);

    const banner = await bannerService.createNewBanner(imageUrl, linkUrl);

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
     next(err)
  }
};




const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get banner from DB
    const banner = await bannerService.getBannerById(id);
    if (!banner) {
  throw new CustomError('Banner not found', 404);
}

    // Extract filename from S3 URL
    const key = banner.imageUrl.split('.com/')[1];

    // Delete from S3
    await awsService.deleteFromS3(key);

    // Delete from DB
    await bannerService.deleteBannerById(id);

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (err) {
    next(err)
  }
};

const fetchNewArrivals = async (req, res, next) => {
  try {
    const products = await bannerService.getNewArrivals()
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err)
  }
};

const softDeleteNewArrival = async (req, res,next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await bannerService.softDeleteNewArrivalService(id);

    res.status(200).json({
      message: 'Product removed from new arrivals.',
      data: updatedProduct,
    });
  } catch (err) {
     next(err)
  }
};


module.exports = {
  fetchNewArrivals,
  deleteBanner,
  getBanner,
  createBanner,
  softDeleteNewArrival
};
