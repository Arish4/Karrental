const express = require('express');
const { uploadCar, getCars, updateCar, deleteCar } = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Ensure correct path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Preserve original name & extension
    }
});

const upload = multer({ storage }); 
const router = express.Router();

router.post('/upload', authMiddleware, upload.single('image'), uploadCar);
router.get('/get', getCars);
router.put('/:id', authMiddleware, upload.single('image'), updateCar);
router.delete('/:id', authMiddleware, deleteCar);

module.exports = router;