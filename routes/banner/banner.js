const express = require('express');
const router = express.Router();
const { getBanner, createBanner,deleteBanner,fetchNewArrivals } = require('../../controllers/banner/bannerController');
const upload = require('../../uploads/multer');

router.get('/', getBanner);
router.post('/', upload.single('image'), createBanner);
router.get('/new-arrivals', fetchNewArrivals); 
router.delete('/:id', deleteBanner);


module.exports = router;
