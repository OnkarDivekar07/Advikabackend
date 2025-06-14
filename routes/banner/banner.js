const express = require('express');
const router = express.Router();
const { getBanner, createBanner } = require('../../controllers/banner/bannerController');
const upload = require('../../uploads/multer');

router.get('/', getBanner);
router.post('/', upload.single('image'), createBanner);

module.exports = router;
