const Place = require("../models/Places")

module.exports = {
    addPlaces: async(req, res, next) => {
        const { county_id, description, imageUrl, location, title, rating, review, latitude, longitude, category } = req.body;

        try {
            const newPlace = new Place({
                county_id, 
                description, 
                imageUrl, 
                location, 
                title, 
                rating, 
                review,
                category, 
                latitude, 
                longitude
            })

            await newPlace.save();

            res.status(201).json({status: true})
        } catch(error) {
            return next(error)
        }
    },

    getPlaces: async(req, res, next) => {
        try {
            const places = await Place.find({}, '_id category review rating location imageUrl title description county_id')

            res.status(200).json({places})
        } catch (error) {
            return next(error)
        }
    },

    getPlace: async(req, res, next) => {
        const placeId = req.params.id;

        try {
            const place = await Place.findById(placeId, {createdAt: 0, updatedAt: 0, _v: 0})

            res.status(200).json({place})
        } catch (error) {
            return next(error)
        }
    },

    getPlacesByCounty: async (req, res, next) => {
        const countyId = req.params.id;

        try {
            const places = await Place.find({county_id: countyId}, {createdAt:0, updatedAt: 0, _v: 0})

            if(places.length === 0) {
                return res.status(200).json([])
            }

            return res.status(200).json({ places })
        } catch(error) {
            return next(error)
        }
    }

    
}