const express = require('express');
const router = express.Router();
const { getBanner, createBanner,deleteBanner } = require('../../controllers/banner/bannerController');
const upload = require('../../uploads/multer');

router.get('/', getBanner);
router.post('/', upload.single('image'), createBanner);
router.delete('/:id', deleteBanner);


module.exports = router;
