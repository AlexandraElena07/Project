const express = require('express');
const router = express.Router();
const Place = require('../models/Places');
const Hotel = require('../models/Hotel');

router.get('/', async (req, res) => {
    const { query, type } = req.query;
    const regex = new RegExp(query, 'i');
    try {
        let results = [];
        if (!type || type === 'places') {
            const placeResults = await Place.find({ title: { $regex: regex } });
            results = results.concat(placeResults);
        }
        if (!type || type === 'hotels') {
            const hotelResults = await Hotel.find({ title: { $regex: regex } });
            results = results.concat(hotelResults);
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error searching for resources", error });
    }
});

router.get('/suggest', async (req, res) => {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    //console.log(`Searching for suggestions with regex: ${regex}`);

    try {
        const places = await Place.find({ title: { $regex: regex } }).limit(5);
        const hotels = await Hotel.find({ title: { $regex: regex } }).limit(5);
        //console.log(`Found places: ${places.length}, hotels: ${hotels.length}`);
        res.status(200).json([...places, ...hotels].slice(0, 5));
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ message: "Error fetching suggestions", error });
    }
});

module.exports = router;
