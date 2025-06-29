const express = require('express');
const router = express.Router();
const { getBanner, createBanner, deleteBanner, fetchNewArrivals, softDeleteNewArrival } = require('../../controllers/banner/bannerController');
const upload = require('../../uploads/multer');
const { createBannerValidator } = require('../../validators/bannerValidator');
const validateRequest = require('../../middlewares/validateRequest/validateRequest');

router.get('/', getBanner);

router.post('/', upload.single('image'), createBannerValidator,
    validateRequest, createBanner);

router.get('/new-arrivals', fetchNewArrivals);

router.patch('/new-arrival/:id', softDeleteNewArrival);

router.delete('/:id', deleteBanner);


module.exports = router;
