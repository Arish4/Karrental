const Car = require('../models/Car');

exports.uploadCar = async (req, res) => {
    try {
        const { name, brand, pricePerDay } = req.body;
        if (!req.file) return res.status(400).json({ error: 'Image is required' });

        // Create full image URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const car = await Car.create({ 
            user: req.user.id, 
            name, 
            brand, 
            pricePerDay, 
            image: imageUrl // Save full image URL
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find().populate('user', 'name email');

        // Convert image filenames to full URLs before sending response
        const carsWithFullImageUrl = cars.map(car => ({
            ...car.toObject(),
            image: `${req.protocol}://${req.get('host')}/uploads/${car.image}`
        }));

        res.json(carsWithFullImageUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car || car.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { name, brand, pricePerDay } = req.body;
        car.name = name || car.name;
        car.brand = brand || car.brand;
        car.pricePerDay = pricePerDay || car.pricePerDay;

        if (req.file) {
            car.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        await car.save();
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car || car.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await car.deleteOne();
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};