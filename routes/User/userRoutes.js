const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/Authentication/auth');
const {registerUser,loginUser,getUserProfile} = require('../../controllers/User/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',auth,getUserProfile)


module.exports = router;
