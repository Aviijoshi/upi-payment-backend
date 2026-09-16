const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/protect')
const {registerUser,loginUser,setUpMpin,getUserProfile} = require('../controllers/authController')

router.post('/register',registerUser);
router.post('/login',loginUser)
router.post('/set-mpin', protect ,setUpMpin)
router.get('/profile',protect,getUserProfile)

module.exports = router;
